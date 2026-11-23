
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import {
    deleteDisposisi,
    getDisposisiById,
    updateDisposisi,
} from '@/modules/disposisi/services/disposisi.service'
import { updateDisposisiSchema } from '@/modules/disposisi/validations/disposisi.schema'

type RouteContext = {
    params: Promise<{ id: string }>
}

async function authorizeManage() {
    const user = await getCurrentUser()

    if (!user) {
        return {
            user: null,
            response: NextResponse.json(
                { success: false, message: 'Silakan login terlebih dahulu' },
                { status: 401 },
            ),
        }
    }

    if (!hasPermission(user.role, 'disposisi.manage')) {
        return {
            user: null,
            response: NextResponse.json(
                { success: false, message: 'Kamu tidak memiliki akses' },
                { status: 403 },
            ),
        }
    }

    return { user, response: null }
}

// GET /api/disposisi/:id
export async function GET(
    _request: NextRequest,
    { params }: RouteContext,
) {
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

    const { id } = await params

    try {
        const data = await getDisposisiById(id)

        if (!data) {
            return NextResponse.json(
                { success: false, message: 'Disposisi tidak ditemukan' },
                { status: 404 },
            )
        }

        if (!canManage && data.dicatatOleh !== user.id) {
            return NextResponse.json(
                { success: false, message: 'Kamu tidak memiliki akses ke disposisi ini' },
                { status: 403 },
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Detail disposisi berhasil diambil',
            data,
        })
    } catch (error) {
        console.error('GET /api/disposisi/[id]:', error)

        return NextResponse.json(
            { success: false, message: 'Gagal mengambil detail disposisi' },
            { status: 500 },
        )
    }
}

// PATCH /api/disposisi/:id
export async function PATCH(
    request: NextRequest,
    { params }: RouteContext,
) {
    const auth = await authorizeManage()

    if (auth.response) return auth.response

    const { id } = await params

    try {
        const body = await request.json()
        const validation = updateDisposisiSchema.safeParse(body)

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

        const data = await updateDisposisi(id, validation.data)

        return NextResponse.json({
            success: true,
            message: 'Disposisi berhasil diperbarui',
            data,
        })
    } catch (error) {
        const errorCode = error instanceof Error ? error.message : ''

        const errorMessages: Record<string, string> = {
            DISPOSISI_NOT_FOUND: 'Disposisi tidak ditemukan',
            SURAT_NOT_FOUND: 'Surat tidak ditemukan',
            PEGAWAI_NOT_FOUND: 'Pegawai penerima tidak ditemukan',
            PEGAWAI_INACTIVE: 'Pegawai penerima sudah tidak aktif',
        }

        if (errorCode in errorMessages) {
            return NextResponse.json(
                { success: false, message: errorMessages[errorCode] },
                { status: errorCode === 'DISPOSISI_NOT_FOUND' ? 404 : 400 },
            )
        }

        console.error('PATCH /api/disposisi/[id]:', error)

        return NextResponse.json(
            { success: false, message: 'Gagal memperbarui disposisi' },
            { status: 500 },
        )
    }
}

// DELETE /api/disposisi/:id
export async function DELETE(
    _request: NextRequest,
    { params }: RouteContext,
) {
    const auth = await authorizeManage()

    if (auth.response) return auth.response

    const { id } = await params

    try {
        const data = await deleteDisposisi(id)

        return NextResponse.json({
            success: true,
            message: 'Disposisi berhasil dihapus',
            data,
        })
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return NextResponse.json(
                { success: false, message: 'Disposisi tidak ditemukan' },
                { status: 404 },
            )
        }

        console.error('DELETE /api/disposisi/[id]:', error)

        return NextResponse.json(
            { success: false, message: 'Gagal menghapus disposisi' },
            { status: 500 },
        )
    }
}
