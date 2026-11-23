
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import type { Permission } from '@/lib/auth/permissions'
import {
    createDisposisi,
    getDisposisi,
} from '@/modules/disposisi/services/disposisi.service'
import { createDisposisiSchema } from '@/modules/disposisi/validations/disposisi.schema'

type AuthResult =
    | {
        authorized: true
        user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
    }
    | {
        authorized: false
        response: NextResponse
    }

async function authorize(permission: Permission): Promise<AuthResult> {
    const user = await getCurrentUser()

    if (!user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: 'Silakan login terlebih dahulu' },
                { status: 401 },
            ),
        }
    }

    if (!hasPermission(user.role, permission)) {
        return {
            authorized: false,
            response: NextResponse.json(
                { success: false, message: 'Kamu tidak memiliki akses' },
                { status: 403 },
            ),
        }
    }

    return { authorized: true, user }
}

// GET /api/disposisi
export async function GET(request: NextRequest) {
    const user = await getCurrentUser()

    if (!user) {
        return NextResponse.json(
            { success: false, message: 'Silakan login terlebih dahulu' },
            { status: 401 },
        )
    }

    const canManage = hasPermission(user.role, 'disposisi.manage')
    const canViewOwn = hasPermission(user.role, 'disposisi.view_own')

    if (!canManage && !canViewOwn) {
        return NextResponse.json(
            { success: false, message: 'Kamu tidak memiliki akses' },
            { status: 403 },
        )
    }

    const searchParams = request.nextUrl.searchParams

    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(
        100,
        Math.max(1, Number(searchParams.get('limit')) || 10),
    )

    const search = searchParams.get('search')?.trim() || ''
    const suratId = searchParams.get('suratId') || undefined
    const kepadaPegawaiId =
        searchParams.get('kepadaPegawaiId') || undefined

    try {
        const result = await getDisposisi({
            page,
            limit,
            search,
            suratId,
            kepadaPegawaiId,
            dicatatOleh: canManage ? undefined : user.id,
        })

        return NextResponse.json({
            success: true,
            message: 'Data disposisi berhasil diambil',
            ...result,
        })
    } catch (error) {
        console.error('GET /api/disposisi:', error)

        return NextResponse.json(
            { success: false, message: 'Gagal mengambil data disposisi' },
            { status: 500 },
        )
    }
}

// POST /api/disposisi
export async function POST(request: NextRequest) {
    const auth = await authorize('disposisi.create')

    if (!auth.authorized) {
        return auth.response
    }

    try {
        const body = await request.json()
        const validation = createDisposisiSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validasi data gagal',
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            )
        }

        const data = await createDisposisi(
            validation.data,
            auth.user.id,
        )

        return NextResponse.json(
            {
                success: true,
                message: 'Disposisi berhasil dibuat',
                data,
            },
            { status: 201 },
        )
    } catch (error) {
        const errorCode = error instanceof Error ? error.message : ''

        const errorMessages: Record<string, string> = {
            SURAT_NOT_FOUND: 'Surat tidak ditemukan',
            PEGAWAI_NOT_FOUND: 'Pegawai penerima tidak ditemukan',
            PEGAWAI_INACTIVE: 'Pegawai penerima sudah tidak aktif',
        }

        if (errorCode in errorMessages) {
            return NextResponse.json(
                { success: false, message: errorMessages[errorCode] },
                { status: 404 },
            )
        }

        console.error('POST /api/disposisi:', error)

        return NextResponse.json(
            { success: false, message: 'Gagal membuat disposisi' },
            { status: 500 },
        )
    }
}
