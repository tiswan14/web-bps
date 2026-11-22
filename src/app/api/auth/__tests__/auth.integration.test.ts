
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3001'
const PASSWORD = 'TestPassword123!'

const users = {
  valid: {
    username: `test_${randomUUID().slice(0, 8)}`,
    email: `valid_${randomUUID()}@test.local`,
  },
  inactive: {
    username: `inactive_${randomUUID().slice(0, 8)}`,
    email: `inactive_${randomUUID()}@test.local`,
  },
  locked: {
    username: `locked_${randomUUID().slice(0, 8)}`,
    email: `locked_${randomUUID()}@test.local`,
  },
  lockout: {
    username: `lockout_${randomUUID().slice(0, 8)}`,
    email: `lockout_${randomUUID()}@test.local`,
  },
}

async function login(identifier: string, password: string) {
  return fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  })
}

describe('Authentication Integration Test', () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL testing belum dikonfigurasi')
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 4)

    await prisma.user.createMany({
      data: [
        {
          ...users.valid,
          passwordHash,
          role: 'ADMIN',
        },
        {
          ...users.inactive,
          passwordHash,
          role: 'PEGAWAI',
          isActive: false,
        },
        {
          ...users.locked,
          passwordHash,
          role: 'PEGAWAI',
          lockedUntil: new Date(Date.now() + 15 * 60 * 1000),
        },
        {
          ...users.lockout,
          passwordHash,
          role: 'PEGAWAI',
          failedLoginCount: 4,
        },
      ],
    })
  })

  afterAll(async () => {
    const usernames = Object.values(users).map((user) => user.username)

    await prisma.user.deleteMany({
      where: {
        username: {
          in: usernames,
        },
      },
    })
  })

  it('should login successfully with valid credentials', async () => {
    const response = await login(users.valid.username, PASSWORD)
    const body = await response.json()
    const setCookie = response.headers.get('set-cookie')

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.message).toBe('Login berhasil')
    expect(body.data.username).toBe(users.valid.username)
    expect(setCookie).toContain('simarlin_session=')

    const user = await prisma.user.findUnique({
      where: { username: users.valid.username },
    })

    expect(user?.lastLoginAt).toBeInstanceOf(Date)
    expect(user?.failedLoginCount).toBe(0)
  })

  it('should reject incorrect password', async () => {
    const response = await login(users.valid.username, 'WrongPassword123!')
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
    expect(body.message).toBe('Username/email atau password salah.')
  })

  it('should reject unknown username', async () => {
    const response = await login('unknown_user_test', PASSWORD)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
    expect(body.message).toBe('Username/email atau password salah.')
  })

  it('should reject inactive account', async () => {
    const response = await login(users.inactive.username, PASSWORD)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
  })

  it('should reject locked account', async () => {
    const response = await login(users.locked.username, PASSWORD)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
  })

  it('should lock account after maximum failed attempts', async () => {
    const response = await login(users.lockout.username, 'WrongPassword123!')
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)

    const user = await prisma.user.findUnique({
      where: { username: users.lockout.username },
    })

    expect(user?.failedLoginCount).toBe(0)
    expect(user?.lockedUntil).toBeInstanceOf(Date)
    expect(user?.lockedUntil?.getTime()).toBeGreaterThan(Date.now())
  })

  it('should logout successfully with a valid session', async () => {
    const loginResponse = await login(users.valid.username, PASSWORD)
    const setCookie = loginResponse.headers.get('set-cookie')

    const cookie = setCookie?.match(/simarlin_session=[^;]+/)?.[0]

    expect(cookie).toBeDefined()

    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookie!,
      },
    })

    const body = await response.json()
    const logoutCookie = response.headers.get('set-cookie')

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.message).toBe('Logout berhasil')
    expect(logoutCookie).toContain('simarlin_session=')
  })

  it('should reject logout without a session', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
    })

    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.success).toBe(false)
  })
})
