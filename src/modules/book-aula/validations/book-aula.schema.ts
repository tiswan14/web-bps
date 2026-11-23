import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const bookAulaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  search: z.string().trim().optional().default(''),
  ruangId: z.string().trim().optional(),
  tanggal: z.iso.date('Format tanggal tidak valid').optional(),
})

export const createBookAulaSchema = z.object({
  ruangId: z.string().trim().min(1, 'Ruang wajib dipilih'),
  tanggal: z.iso.date('Format tanggal tidak valid'),
  jamMulai: z
    .string()
    .regex(timeRegex, 'Format jam mulai tidak valid (HH:mm)'),
  jamSelesai: z
    .string()
    .regex(timeRegex, 'Format jam selesai tidak valid (HH:mm)'),
  namaPeminjam: z.string().trim().min(1, 'Nama peminjam wajib diisi'),
  jumlahPeserta: z.coerce
    .number()
    .int()
    .min(1, 'Jumlah peserta minimal 1 orang'),
  kegiatan: z.string().trim().min(1, 'Nama kegiatan wajib diisi'),
})

export const updateBookAulaSchema = createBookAulaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Tidak ada data untuk diperbarui',
  })

export type BookAulaQueryInput = z.infer<typeof bookAulaQuerySchema>
export type CreateBookAulaSchemaInput = z.infer<typeof createBookAulaSchema>
export type UpdateBookAulaSchemaInput = z.infer<typeof updateBookAulaSchema>
