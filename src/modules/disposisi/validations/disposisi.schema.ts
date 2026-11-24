import { z } from 'zod'

export const createDisposisiSchema = z.object({
  suratId: z.string().min(1, 'Surat wajib dipilih'),
  kepadaPegawaiId: z.string().min(1, 'Pegawai penerima wajib dipilih'),
  instruksi: z.string().trim().min(1, 'Instruksi wajib diisi'),
  tanggal: z.iso.date('Format tanggal tidak valid'),
})

export const updateDisposisiSchema = createDisposisiSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Tidak ada data untuk diperbarui' },
)

export type CreateDisposisiInput = z.infer<typeof createDisposisiSchema>
export type UpdateDisposisiInput = z.infer<typeof updateDisposisiSchema>