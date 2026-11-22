
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session-token'

const LOGIN_PATH = '/login'

const PUBLIC_API_PATHS = [
  '/api/auth/login',
  '/api/auth/logout',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicApi = PUBLIC_API_PATHS.includes(pathname)

  if (isPublicApi || pathname === LOGIN_PATH) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const userId = token ? await verifySessionToken(token) : null

  if (userId) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      {
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Sesi tidak valid atau sudah berakhir.',
        },
      },
      { status: 401 },
    )
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)',
  ],
}
