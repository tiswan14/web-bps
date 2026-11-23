
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api/response'
import {
    createSuratSchema,
    suratQuerySchema,
} from '@/modules/surat/validations/surat.schema'
import {
    getSurat,
    createSurat,
} from '@/modules/surat/services/surat.service'
import { cookies } from 'next/headers'
import {
    SESSION_COOKIE_NAME,
    verifySessionToken,
} from '@/lib/session-token'


// GET /api/surat

export async function GET(request: NextRequest) {
    try {
        const searchParams = Object.fromEntries(
            request.nextUrl.searchParams.entries(),
        )

        const validation = suratQuerySchema.safeParse(searchParams)

        if (!validation.success) {
            return apiError({
                message: 'Parameter pencarian tidak valid',
                status: 400,
                errors: validation.error.flatten(),
            })
        }

        const result = await getSurat(validation.data)

        return apiSuccess({
            message: 'Data surat berhasil ditemukan',
            data: result,
        })
    } catch (error) {
        console.error('GET /api/surat:', error)

        return apiError({
            message: 'Terjadi kesalahan saat mengambil data surat',
            status: 500,
        })
    }
}


// POST /api/surat
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

        const userId = token
            ? await verifySessionToken(token)
            : null

        if (!userId) {
            return apiError({
                message: 'Sesi tidak valid atau sudah berakhir',
                status: 401,
            })
        }

        const body = await request.json()
        const validation = createSuratSchema.safeParse(body)

        if (!validation.success) {
            return apiError({
                message: 'Data surat tidak valid',
                status: 400,
                errors: validation.error.flatten(),
            })
        }

        const surat = await createSurat(
            validation.data,
            userId,
        )

        return apiSuccess({
            message: 'Surat berhasil dibuat',
            data: surat,
            status: 201,
        })
    } catch (error) {
        console.error('POST /api/surat:', error)

        return apiError({
            message: 'Terjadi kesalahan saat membuat surat',
            status: 500,
        })
    }
}
