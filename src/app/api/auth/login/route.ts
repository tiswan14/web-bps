
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15
const LOGIN_ERROR_MESSAGE = 'Username/email atau password salah.'

const dummyHash = bcrypt.hash('password-palsu', 12)

async function registerFailedAttempt(
  userId: string,
  currentCount: number,
): Promise<void> {
  const nextCount = currentCount + 1
  const shouldLock = nextCount >= MAX_FAILED_ATTEMPTS

  await prisma.user.update({
    where: { id: userId },
    data: shouldLock
      ? {
        failedLoginCount: 0,
        lockedUntil: new Date(
          Date.now() + LOCK_DURATION_MINUTES * 60 * 1000,
        ),
      }
      : {
        failedLoginCount: nextCount,
      },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format request tidak valid',
        },
        { status: 400 },
      )
    }

    const payload = body as Record<string, unknown>

    const identifier =
      typeof payload.identifier === 'string'
        ? payload.identifier.slice(0, 100).trim().toLowerCase()
        : ''

    const password =
      typeof payload.password === 'string'
        ? payload.password.slice(0, 200)
        : ''

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: LOGIN_ERROR_MESSAGE,
        },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({
      where: identifier.includes('@')
        ? { email: identifier }
        : { username: identifier },
    })

    const passwordMatches = await bcrypt.compare(
      password,
      user?.passwordHash ?? (await dummyHash),
    )

    const isLocked =
      !!user?.lockedUntil && user.lockedUntil > new Date()

    if (!user || isLocked || !user.isActive || !passwordMatches) {
      if (user && !isLocked) {
        await registerFailedAttempt(
          user.id,
          user.failedLoginCount,
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: LOGIN_ERROR_MESSAGE,
        },
        { status: 401 },
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    })

    await createSession(user.id)

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('[POST /api/auth/login]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server',
      },
      { status: 500 },
    )
  }
}
