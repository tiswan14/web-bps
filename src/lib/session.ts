import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import {
  SESSION_COOKIE_NAME,
  getSecretKey,
  verifySessionToken,
} from '@/lib/session-token'

const SESSION_DURATION_HOURS = 12
const SESSION_DURATION_SECONDS = SESSION_DURATION_HOURS * 60 * 60

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(getSecretKey())

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function readSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return token ? verifySessionToken(token) : null
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
