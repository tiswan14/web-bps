
import { NextRequest } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiError } from '@/lib/api/response'
import {
    updateSuratSchema,
} from '@/modules/surat/validations/surat.schema'
import {
    getSuratById,
    updateSurat,
    deleteSurat,
} from '@/modules/surat/services/surat.service'

interface RouteContext {
    params: Promise<{
        id: string
    }>
}

// GET /api/surat/:id
export async function GET(
    _request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { id } = await params

        const surat = await getSuratById(id)

        if (!surat) {
            return apiError({
                message: 'Surat tidak ditemukan',
                status: 404,
            })
        }

        return apiSuccess({
            message: 'Detail surat berhasil ditemukan',
            data: surat,
        })
    } catch (error) {
        console.error('GET /api/surat/[id]:', error)

        return apiError({
            message: 'Terjadi kesalahan saat mengambil detail surat',
            status: 500,
        })
    }
}

// PATCH /api/surat/:id
export async function PATCH(
    request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { id } = await params

        const body = await request.json()
        const validation = updateSuratSchema.safeParse(body)

        if (!validation.success) {
            return apiError({
                message: 'Data surat tidak valid',
                status: 400,
                errors: validation.error.flatten(),
            })
        }

        const surat = await updateSurat(id, validation.data)

        return apiSuccess({
            message: 'Surat berhasil diperbarui',
            data: surat,
        })
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return apiError({
                message: 'Surat tidak ditemukan',
                status: 404,
            })
        }

        console.error('PATCH /api/surat/[id]:', error)

        return apiError({
            message: 'Terjadi kesalahan saat memperbarui surat',
            status: 500,
        })
    }
}

// DELETE /api/surat/:id
export async function DELETE(
    _request: NextRequest,
    { params }: RouteContext,
) {
    try {
        const { id } = await params

        await deleteSurat(id)

        return apiSuccess({
            message: 'Surat berhasil dihapus',
            data: null,
        })
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return apiError({
                message: 'Surat tidak ditemukan',
                status: 404,
            })
        }

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2003'
        ) {
            return apiError({
                message: 'Surat tidak dapat dihapus karena masih memiliki disposisi',
                status: 409,
            })
        }

        console.error('DELETE /api/surat/[id]:', error)

        return apiError({
            message: 'Terjadi kesalahan saat menghapus surat',
            status: 500,
        })
    }
}
