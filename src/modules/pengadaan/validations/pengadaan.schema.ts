import { z } from 'zod'

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/

const statusEnum = z.enum([
  'DRAFT',
  'USULAN',
  'PROSES',
  'KONTRAK',
  'SELESAI',
  'BATAL',
])

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((val) => (val && val.length > 0 ? val : null))

const optionalIsoDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine((val) => !val || isoDateRegex.test(val), {
    message: 'Format tanggal tidak valid (YYYY-MM-DD)',
  })
  .transform((val) => (val && val.length > 0 ? val : null))

export const pengadaanQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  search: z.string().trim().optional().default(''),
  bulan: z.string().trim().optional(),
  tahun: z.coerce.number().int().optional(),
  status: statusEnum.optional(),
})

export const createPengadaanSchema = z.object({
  tanggalUsulan: z
    .string()
    .regex(isoDateRegex, 'Format tanggal usulan tidak valid (YYYY-MM-DD)'),
  jenisPengadaan: z.enum(['BARANG', 'JASA']).default('BARANG'),
  namaProduk: z.string().trim().min(1, 'Nama produk barang/jasa wajib diisi'),
  detilPok: z.string().trim().min(1, 'Nama kegiatan / detil POK wajib diisi'),
  kodePok: z.string().trim().min(1, 'Kode POK wajib diisi'),
  status: statusEnum.default('USULAN'),
  rencana: z.coerce
    .number()
    .int()
    .min(1, 'Rencana pembelanjaan (RAB) harus lebih dari 0'),
  realisasi: z.coerce
    .number()
    .int()
    .min(0, 'Nilai realisasi tidak boleh negatif')
    .default(0),
  formPermintaan: optionalText,
  linkKak: optionalText,
  jenisDokumen: optionalText,
  nomorDokumen: optionalText,
  tanggalDokumen: optionalIsoDate,
  namaPenyedia: optionalText,
  tanggalPembayaran: optionalIsoDate,
  nomorBuktiPembayaran: optionalText,
  linkEpurchasing: optionalText,
  keterangan: optionalText,
})

export const updatePengadaanSchema = createPengadaanSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Tidak ada data pengadaan untuk diperbarui',
  })

export type PengadaanQueryInput = z.infer<typeof pengadaanQuerySchema>
export type CreatePengadaanSchemaInput = z.infer<typeof createPengadaanSchema>
export type UpdatePengadaanSchemaInput = z.infer<typeof updatePengadaanSchema>
