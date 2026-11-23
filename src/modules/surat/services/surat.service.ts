
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type {
    CreateSuratSchema,
    UpdateSuratSchema,
    SuratQuerySchema,
} from '../validations/surat.schema'

const suratInclude = {
    pencatat: {
        select: {
            id: true,
            username: true,
            email: true,
        },
    },
    periode: {
        select: {
            tahun: true,
        },
    },
} satisfies Prisma.SuratInclude

// GET: Daftar surat
export async function getSurat(params: SuratQuerySchema) {
    const { page, limit, search, jenis, sifat, tahun } = params

    const where: Prisma.SuratWhereInput = {
        ...(jenis && { jenis }),
        ...(sifat && { sifat }),
        ...(tahun && { periodeId: tahun }),
        ...(search && {
            OR: [
                {
                    nomor: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    asalTujuan: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    perihal: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        }),
    }

    const [data, total] = await Promise.all([
        prisma.surat.findMany({
            where,
            include: suratInclude,
            orderBy: {
                tanggal: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.surat.count({ where }),
    ])

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

// GET: Detail surat
export async function getSuratById(id: string) {
    return prisma.surat.findUnique({
        where: { id },
        include: {
            ...suratInclude,
            disposisi: {
                include: {
                    kepada: {
                        select: {
                            id: true,
                            nama: true,
                            nip: true,
                        },
                    },
                    pencatat: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            },
        },
    })
}

// POST: Buat surat
export async function createSurat(
    input: CreateSuratSchema,
    dicatatOleh: string,
) {
    const periode = await prisma.periode.findUnique({
        where: {
            tahun: input.periodeId,
        },
    })

    if (!periode) {
        throw new Error('Periode pencatatan tidak ditemukan')
    }

    const { tanggal, ...rest } = input

    return prisma.surat.create({
        data: {
            ...rest,
            tanggal: new Date(`${tanggal}T00:00:00.000Z`),
            dicatatOleh,
        },
        include: suratInclude,
    })
}

// PATCH: Update surat
export async function updateSurat(
    id: string,
    input: UpdateSuratSchema,
) {
    if (input.periodeId !== undefined) {
        const periode = await prisma.periode.findUnique({
            where: {
                tahun: input.periodeId,
            },
        })

        if (!periode) {
            throw new Error('Periode pencatatan tidak ditemukan')
        }
    }

    const { tanggal, ...rest } = input

    return prisma.surat.update({
        where: { id },
        data: {
            ...rest,
            ...(tanggal !== undefined && {
                tanggal: new Date(`${tanggal}T00:00:00.000Z`),
            }),
        },
        include: suratInclude,
    })
}

// DELETE: Hapus surat
export async function deleteSurat(id: string) {
    return prisma.surat.delete({
        where: { id },
    })
}
