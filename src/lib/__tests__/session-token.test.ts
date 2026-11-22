
import { afterEach, describe, expect, it } from 'vitest'
import { SignJWT } from 'jose'
import {
  getSecretKey,
  verifySessionToken,
} from '@/lib/session-token'

const SECRET = 'test-session-secret-minimum-32-characters'

afterEach(() => {
  delete process.env.SESSION_SECRET
})

describe('getSecretKey', () => {
  it('should return encoded secret when valid', () => {
    process.env.SESSION_SECRET = SECRET

    expect(getSecretKey()).toBeInstanceOf(Uint8Array)
  })

  it('should throw error when secret is missing', () => {
    delete process.env.SESSION_SECRET

    expect(() => getSecretKey()).toThrow()
  })

  it('should throw error when secret is too short', () => {
    process.env.SESSION_SECRET = 'short-secret'

    expect(() => getSecretKey()).toThrow()
  })
})

describe('verifySessionToken', () => {
  it('should return user ID for a valid token', async () => {
    process.env.SESSION_SECRET = SECRET

    const token = await new SignJWT({ userId: 'user-test-123' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(getSecretKey())

    await expect(verifySessionToken(token)).resolves.toBe('user-test-123')
  })

  it('should return null for an invalid token', async () => {
    process.env.SESSION_SECRET = SECRET

    await expect(
      verifySessionToken('invalid-token'),
    ).resolves.toBeNull()
  })

  it('should return null for an expired token', async () => {
    process.env.SESSION_SECRET = SECRET

    const token = await new SignJWT({ userId: 'user-test-123' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('-1h')
      .sign(getSecretKey())

    await expect(verifySessionToken(token)).resolves.toBeNull()
  })

  it('should return null when userId is missing', async () => {
    process.env.SESSION_SECRET = SECRET

    const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(getSecretKey())

    await expect(verifySessionToken(token)).resolves.toBeNull()
  })
})
