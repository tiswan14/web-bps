import { jwtVerify } from 'jose'

export const SESSION_COOKIE_NAME = 'simarlin_session'

export function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET belum diisi atau kurang dari 32 karakter')
  }
  return new TextEncoder().encode(secret)
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    })
    return typeof payload.userId === 'string' ? payload.userId : null
  } catch {
    return null
  }
}
