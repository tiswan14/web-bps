
import { prisma } from '@/lib/prisma'
import type {
    CreateDisposisiInput,
    UpdateDisposisiInput,
} from '../validations/disposisi.schema'

const disposisiSelect = {
    id: true,
    suratId: true,
    kepadaPegawaiId: true,
    dicatatOleh: true,
    instruksi: true,
    tanggal: true,
    createdAt: true,
    updatedAt: true,
    surat: {
        select: {
            id: true,
            nomor: true,
            jenis: true,
            tanggal: true,
            asalTujuan: true,
            perihal: true,
        },
    },
    kepada: {
        select: {
            id: true,
            nama: true,
            nip: true,
            jabatan: true,
            aktif: true,
        },
    },
    pencatat: {
        select: {
            id: true,
            username: true,
            email: true,
        },
    },
}

type GetDisposisiParams = {
    page: number
    limit: number
    search: string
    suratId?: string
    kepadaPegawaiId?: string
    dicatatOleh?: string
}

export async function getDisposisi(params: GetDisposisiParams) {
    const {
        page,
        limit,
        search,
        suratId,
        kepadaPegawaiId,
        dicatatOleh,
    } = params

    const where = {
        ...(suratId && { suratId }),
        ...(kepadaPegawaiId && { kepadaPegawaiId }),
        ...(dicatatOleh && { dicatatOleh }),
        ...(search && {
            OR: [
                {
                    surat: {
                        nomor: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    },
                },
                {
                    surat: {
                        perihal: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    },
                },
                {
                    surat: {
                        asalTujuan: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    },
                },
                {
                    kepada: {
                        nama: {
                            contains: search,
                            mode: 'insensitive' as const,
                        },
                    },
                },
                {
                    kepada: {
                        nip: {
                            contains: search,
                        },
                    },
                },
                {
                    instruksi: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
            ],
        }),
    }

    const [data, total] = await prisma.$transaction([
        prisma.disposisi.findMany({
            where,
            select: disposisiSelect,
            orderBy: [{ tanggal: 'desc' }, { updatedAt: 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.disposisi.count({ where }),
    ])

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    }
}

export async function getDisposisiById(id: string) {
    return prisma.disposisi.findUnique({
        where: { id },
        select: disposisiSelect,
    })
}

export async function createDisposisi(
    input: CreateDisposisiInput,
    userId: string,
) {
    const [surat, pegawai] = await Promise.all([
        prisma.surat.findUnique({
            where: { id: input.suratId },
            select: { id: true },
        }),
        prisma.pegawai.findUnique({
            where: { id: input.kepadaPegawaiId },
            select: { id: true, aktif: true },
        }),
    ])

    if (!surat) throw new Error('SURAT_NOT_FOUND')
    if (!pegawai) throw new Error('PEGAWAI_NOT_FOUND')
    if (!pegawai.aktif) throw new Error('PEGAWAI_INACTIVE')

    return prisma.disposisi.create({
        data: {
            suratId: input.suratId,
            kepadaPegawaiId: input.kepadaPegawaiId,
            dicatatOleh: userId,
            instruksi: input.instruksi,
            tanggal: new Date(`${input.tanggal}T00:00:00.000Z`),
        },
        select: disposisiSelect,
    })
}

export async function updateDisposisi(
    id: string,
    input: UpdateDisposisiInput,
) {
    const existing = await prisma.disposisi.findUnique({
        where: { id },
        select: { id: true },
    })

    if (!existing) throw new Error('DISPOSISI_NOT_FOUND')

    if (input.suratId) {
        const surat = await prisma.surat.findUnique({
            where: { id: input.suratId },
            select: { id: true },
        })

        if (!surat) throw new Error('SURAT_NOT_FOUND')
    }

    if (input.kepadaPegawaiId) {
        const pegawai = await prisma.pegawai.findUnique({
            where: { id: input.kepadaPegawaiId },
            select: { id: true, aktif: true },
        })

        if (!pegawai) throw new Error('PEGAWAI_NOT_FOUND')
        if (!pegawai.aktif) throw new Error('PEGAWAI_INACTIVE')
    }

    return prisma.disposisi.update({
        where: { id },
        data: {
            ...(input.suratId !== undefined && { suratId: input.suratId }),
            ...(input.kepadaPegawaiId !== undefined && {
                kepadaPegawaiId: input.kepadaPegawaiId,
            }),
            ...(input.instruksi !== undefined && {
                instruksi: input.instruksi,
            }),
            ...(input.tanggal !== undefined && {
                tanggal: new Date(`${input.tanggal}T00:00:00.000Z`),
            }),
        },
        select: disposisiSelect,
    })
}

export async function deleteDisposisi(id: string) {
    return prisma.disposisi.delete({
        where: { id },
        select: {
            id: true,
            suratId: true,
            kepadaPegawaiId: true,
            instruksi: true,
        },
    })
}
