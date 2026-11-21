import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
type UserRole = CurrentUser['role']

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

export async function requireApiUser(allowedRoles?: UserRole[]): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Sesi tidak valid atau sudah berakhir.')
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'Anda tidak berhak mengakses data ini.')
  }
  return user
}

function assertSameOrigin(request: NextRequest): void {
  const origin = request.headers.get('origin')
  if (!origin || origin !== request.nextUrl.origin) {
    throw new ApiError(403, 'INVALID_ORIGIN', 'Asal permintaan tidak diizinkan.')
  }
}

type Handler<Context> = (request: NextRequest, context: Context) => Promise<Response>

export function withApi<Context>(handler: Handler<Context>): Handler<Context> {
  return async (request, context) => {
    try {
      if (!SAFE_METHODS.has(request.method)) {
        assertSameOrigin(request)
      }
      return await handler(request, context)
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: { code: error.code, message: error.message } },
          { status: error.status },
        )
      }
      console.error(error)
      return NextResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server.' } },
        { status: 500 },
      )
    }
  }
}
