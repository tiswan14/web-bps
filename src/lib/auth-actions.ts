'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15
const LOGIN_ERROR_MESSAGE = 'Username/email atau password salah.'

export type LoginState = { error: string | null }

// Hash palsu supaya waktu respons tetap mirip walau akun tidak ditemukan
const dummyHash = bcrypt.hash('password-palsu', 12)

function readText(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value.slice(0, maxLength) : ''
}

async function registerFailedAttempt(userId: string, currentCount: number) {
  const nextCount = currentCount + 1
  const shouldLock = nextCount >= MAX_FAILED_ATTEMPTS

  await prisma.user.update({
    where: { id: userId },
    data: shouldLock
      ? {
          failedLoginCount: 0,
          lockedUntil: new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000),
        }
      : { failedLoginCount: nextCount },
  })
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identifier = readText(formData, 'identifier', 100).trim().toLowerCase()
  const password = readText(formData, 'password', 200)

  if (!identifier || !password) {
    return { error: LOGIN_ERROR_MESSAGE }
  }

  const user = await prisma.user.findUnique({
    where: identifier.includes('@') ? { email: identifier } : { username: identifier },
  })

  const isLocked = !!user?.lockedUntil && user.lockedUntil > new Date()
  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash ?? (await dummyHash),
  )

  if (!user || isLocked || !user.isActive || !passwordMatches) {
    if (user && !isLocked) {
      await registerFailedAttempt(user.id, user.failedLoginCount)
    }
    return { error: LOGIN_ERROR_MESSAGE }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
  })
  await createSession(user.id)
  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
