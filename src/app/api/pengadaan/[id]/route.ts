import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { Prisma } from '@/generated/prisma/client'
import { apiError, apiSuccess } from '@/lib/api/response'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session-token'
import { updatePengadaanSchema } from '@/modules/pengadaan/validations/pengadaan.schema'
import {
  deletePengadaan,
  getPengadaanById,
  updatePengadaan,
} from '@/modules/pengadaan/services/pengadaan.service'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET /api/pengadaan/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const item = await getPengadaanById(id)

    if (!item) {
      return apiError({
        message: 'Data pengadaan tidak ditemukan',
        status: 404,
      })
    }

    return apiSuccess({
      message: 'Detail pengadaan berhasil ditemukan',
      data: item,
    })
  } catch (error) {
    console.error('GET /api/pengadaan/[id]:', error)
    return apiError({
      message: 'Terjadi kesalahan saat mengambil detail pengadaan',
      status: 500,
    })
  }
}

// PATCH /api/pengadaan/:id
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
    const validation = updatePengadaanSchema.safeParse(body)

    if (!validation.success) {
      return apiError({
        message: 'Data pengadaan tidak valid',
        status: 400,
        errors: validation.error.flatten(),
      })
    }

    const updated = await updatePengadaan(id, validation.data)

    return apiSuccess({
      message: 'Data pengadaan berhasil diperbarui',
      data: updated,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return apiError({
        message: 'Data pengadaan tidak ditemukan',
        status: 404,
      })
    }

    console.error('PATCH /api/pengadaan/[id]:', error)
    return apiError({
      message: 'Terjadi kesalahan saat memperbarui data pengadaan',
      status: 500,
    })
  }
}

// DELETE /api/pengadaan/:id
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
    await deletePengadaan(id)

    return apiSuccess({
      message: 'Data pengadaan berhasil dihapus',
      data: null,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return apiError({
        message: 'Data pengadaan tidak ditemukan',
        status: 404,
      })
    }

    console.error('DELETE /api/pengadaan/[id]:', error)
    return apiError({
      message: 'Terjadi kesalahan saat menghapus data pengadaan',
      status: 500,
    })
  }
}
