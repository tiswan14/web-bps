

import type {
    JenisSurat,
    SifatSurat,
    Prisma,
} from '@/generated/prisma/client'

export interface SuratCreateInput {
    jenis: JenisSurat
    nomor: string
    tanggal: Date
    asalTujuan: string
    perihal: string
    sifat?: SifatSurat
    pengantaran?: string | null
    status?: string | null
    periodeId: number
}

export interface SuratUpdateInput {
    jenis?: JenisSurat
    nomor?: string
    tanggal?: Date
    asalTujuan?: string
    perihal?: string
    sifat?: SifatSurat
    pengantaran?: string | null
    status?: string | null
    periodeId?: number
}

export interface SuratQueryParams {
    page: number
    limit: number
    search?: string
    jenis?: JenisSurat
    sifat?: SifatSurat
    tahun?: number
}

export type SuratWithRelations = Prisma.SuratGetPayload<{
    include: {
        pencatat: {
            select: {
                id: true
                username: true
                email: true
            }
        }
        periode: true
    }
}>
