import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { apiError, apiSuccess } from '@/lib/api/response'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session-token'
import {
  bookAulaQuerySchema,
  createBookAulaSchema,
} from '@/modules/book-aula/validations/book-aula.schema'
import {
  BookAulaDomainError,
  createBookingAula,
  getBookingAulaList,
} from '@/modules/book-aula/services/book-aula.service'

// GET /api/book-aula
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    )

    const validation = bookAulaQuerySchema.safeParse(searchParams)
    if (!validation.success) {
      return apiError({
        message: 'Parameter pencarian pemesanan ruang tidak valid',
        status: 400,
        errors: validation.error.flatten(),
      })
    }

    const result = await getBookingAulaList(validation.data)

    return apiSuccess({
      message: 'Data pemesanan ruang berhasil diambil',
      data: result,
    })
  } catch (error) {
    console.error('GET /api/book-aula:', error)
    return apiError({
      message: 'Terjadi kesalahan saat mengambil data pemesanan ruang',
      status: 500,
    })
  }
}

// POST /api/book-aula
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    const userId = token ? await verifySessionToken(token) : null

    if (!userId) {
      return apiError({
        message: 'Sesi tidak valid atau sudah berakhir',
        status: 401,
      })
    }

    const body = await request.json()
    const validation = createBookAulaSchema.safeParse(body)

    if (!validation.success) {
      return apiError({
        message: 'Data pemesanan ruang tidak valid',
        status: 400,
        errors: validation.error.flatten(),
      })
    }

    const booking = await createBookingAula(validation.data, userId)

    return apiSuccess({
      message: 'Pemesanan ruang berhasil dibuat',
      data: booking,
      status: 201,
    })
  } catch (error) {
    if (error instanceof BookAulaDomainError) {
      const status = error.code === 'SCHEDULE_CONFLICT' ? 409 : 400
      return apiError({
        message: error.message,
        status,
      })
    }

    console.error('POST /api/book-aula:', error)
    return apiError({
      message: 'Terjadi kesalahan saat membuat pemesanan ruang',
      status: 500,
    })
  }
}
