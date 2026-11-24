import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { apiError, apiSuccess } from '@/lib/api/response'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session-token'
import {
  createPengadaanSchema,
  pengadaanQuerySchema,
} from '@/modules/pengadaan/validations/pengadaan.schema'
import {
  createPengadaan,
  getPengadaanList,
} from '@/modules/pengadaan/services/pengadaan.service'

// GET /api/pengadaan
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    )

    const validation = pengadaanQuerySchema.safeParse(searchParams)
    if (!validation.success) {
      return apiError({
        message: 'Parameter pencarian pengadaan tidak valid',
        status: 400,
        errors: validation.error.flatten(),
      })
    }

    const result = await getPengadaanList(validation.data)

    return apiSuccess({
      message: 'Data pengadaan berhasil diambil',
      data: result,
    })
  } catch (error) {
    console.error('GET /api/pengadaan:', error)
    return apiError({
      message: 'Terjadi kesalahan saat mengambil data pengadaan',
      status: 500,
    })
  }
}

// POST /api/pengadaan
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
    const validation = createPengadaanSchema.safeParse(body)

    if (!validation.success) {
      return apiError({
        message: 'Data pengadaan tidak valid',
        status: 400,
        errors: validation.error.flatten(),
      })
    }

    const created = await createPengadaan(validation.data, userId)

    return apiSuccess({
      message: 'Data pengadaan berhasil ditambahkan',
      data: created,
      status: 201,
    })
  } catch (error) {
    console.error('POST /api/pengadaan:', error)
    return apiError({
      message: 'Terjadi kesalahan saat menyimpan data pengadaan',
      status: 500,
    })
  }
}
