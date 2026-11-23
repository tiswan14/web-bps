
import { z } from 'zod'

const optionalText = z
    .string()
    .trim()
    .nullable()
    .transform((value) => value || null)

export const createPegawaiSchema = z.object({
    nama: z.string().trim().min(1, 'Nama wajib diisi'),
    nip: z.string().trim().min(1, 'NIP wajib diisi'),
    email: z.union([
        z.literal(''),
        z.string().trim().email('Format email tidak valid'),
    ]).nullable().optional(),
    nipBps: optionalText.optional(),
    golonganAkhir: optionalText.optional(),
    pangkat: optionalText.optional(),
    jabatan: optionalText.optional(),
    fungsiId: optionalText.optional(),
})

export const updatePegawaiSchema = z.object({
    nama: z.string().trim().min(1, 'Nama tidak boleh kosong').optional(),
    nip: z.string().trim().min(1, 'NIP tidak boleh kosong').optional(),
    email: z
        .string()
        .trim()
        .email('Format email tidak valid')
        .or(z.literal(''))
        .nullable()
        .optional(),
    nipBps: optionalText.optional(),
    golonganAkhir: optionalText.optional(),
    pangkat: optionalText.optional(),
    jabatan: optionalText.optional(),
    fungsiId: optionalText.optional(),
    aktif: z.boolean().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Tidak ada data untuk diperbarui' },
)

export type CreatePegawaiInput = z.infer<typeof createPegawaiSchema>
export type UpdatePegawaiInput = z.infer<typeof updatePegawaiSchema>
