import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { Prisma } from '@/generated/prisma/client'
import { apiError, apiSuccess } from '@/lib/api/response'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session-token'
import { updateBookAulaSchema } from '@/modules/book-aula/validations/book-aula.schema'
import {
  BookAulaDomainError,
  deleteBookingAula,
  getBookingAulaById,
  updateBookingAula,
} from '@/modules/book-aula/services/book-aula.service'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET /api/book-aula/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const booking = await getBookingAulaById(id)

    if (!booking) {
      return apiError({
        message: 'Pemesanan ruang tidak ditemukan',
        status: 404,
      })
    }

    return apiSuccess({
      message: 'Detail pemesanan ruang berhasil ditemukan',
      data: booking,
    })
  } catch (error) {
    console.error('GET /api/book-aula/[id]:', error)
    return apiError({
      message: 'Terjadi kesalahan saat mengambil detail pemesanan ruang',
      status: 500,
    })
  }
}

// PATCH /api/book-aula/:id
export async function PATCH(request: NextRequest, { params }: RouteContext) {
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

    const { id } = await params
    const body = await request.json()
    const validation = updateBookAulaSchema.safeParse(body)

    if (!validation.success) {
      return apiError({
        message: 'Data pemesanan ruang tidak valid',
        status: 400,
        errors: validation.error.flatten(),
      })
    }

    const updated = await updateBookingAula(id, validation.data)

    return apiSuccess({
      message: 'Pemesanan ruang berhasil diperbarui',
      data: updated,
    })
  } catch (error) {
    if (error instanceof BookAulaDomainError) {
      const status =
        error.code === 'BOOKING_NOT_FOUND'
          ? 404
          : error.code === 'SCHEDULE_CONFLICT'
            ? 409
            : 400
      return apiError({
        message: error.message,
        status,
      })
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return apiError({
        message: 'Pemesanan ruang tidak ditemukan',
        status: 404,
      })
    }

    console.error('PATCH /api/book-aula/[id]:', error)
    return apiError({
      message: 'Terjadi kesalahan saat memperbarui pemesanan ruang',
      status: 500,
    })
  }
}

// DELETE /api/book-aula/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
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

    const { id } = await params
    await deleteBookingAula(id)

    return apiSuccess({
      message: 'Pemesanan ruang berhasil dibatalkan',
      data: null,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return apiError({
        message: 'Pemesanan ruang tidak ditemukan',
        status: 404,
      })
    }

    console.error('DELETE /api/book-aula/[id]:', error)
    return apiError({
      message: 'Terjadi kesalahan saat membatalkan pemesanan ruang',
      status: 500,
    })
  }
}
