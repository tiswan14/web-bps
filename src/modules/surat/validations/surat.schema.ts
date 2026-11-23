
import { z } from 'zod'
import { JenisSurat, SifatSurat } from '@/generated/prisma/client'

export const createSuratSchema = z.object({
    jenis: z.enum(JenisSurat),
    nomor: z.string().trim().min(1, 'Nomor surat wajib diisi'),
    tanggal: z.iso.date('Format tanggal harus YYYY-MM-DD'),
    asalTujuan: z.string().trim().min(1, 'Asal atau tujuan wajib diisi'),
    perihal: z.string().trim().min(1, 'Perihal wajib diisi'),
    sifat: z.enum(SifatSurat).default(SifatSurat.BIASA),
    pengantaran: z.string().trim().nullable().optional(),
    status: z.string().trim().nullable().optional(),
    periodeId: z.number().int().min(2000, 'Tahun periode tidak valid'),
})

export const updateSuratSchema = createSuratSchema.partial()

export const suratQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    jenis: z.enum(JenisSurat).optional(),
    sifat: z.enum(SifatSurat).optional(),
    tahun: z.coerce.number().int().min(2000).optional(),
})

export type CreateSuratSchema = z.infer<typeof createSuratSchema>
export type UpdateSuratSchema = z.infer<typeof updateSuratSchema>
export type SuratQuerySchema = z.infer<typeof suratQuerySchema>
