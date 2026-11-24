import { z } from 'zod'

export const createAjuanPulsaSchema = z
  .object({
    bulan: z.coerce.number().int().min(1).max(12),
    tahun: z.coerce.number().int().min(2020).max(2100),
    namaKegiatan: z
      .string()
      .trim()
      .min(3, 'Nama kegiatan minimal 3 karakter')
      .max(200, 'Nama kegiatan maksimal 200 karakter'),
    nominalPerOrang: z.coerce
      .number()
      .int('Nominal harus bilangan bulat')
      .min(1000, 'Nominal pulsa minimal Rp 1.000'),
    keterangan: z.string().trim().max(500).optional(),
    pegawaiIds: z.array(z.string().min(1)).default([]),
    mitraIds: z.array(z.string().min(1)).default([]),
  })
  .refine((data) => data.pegawaiIds.length + data.mitraIds.length > 0, {
    message: 'Pilih minimal 1 petugas Organik atau Mitra Statistik',
    path: ['pegawaiIds'],
  })

export const updateKegiatanPulsaSchema = z
  .object({
    namaKegiatan: z
      .string()
      .trim()
      .min(3, 'Nama kegiatan minimal 3 karakter')
      .max(200, 'Nama kegiatan maksimal 200 karakter'),
    nominalPerOrang: z.coerce
      .number()
      .int('Nominal harus bilangan bulat')
      .min(1000, 'Nominal pulsa minimal Rp 1.000'),
    keterangan: z.string().trim().max(500).optional(),
    pegawaiIds: z.array(z.string().min(1)).default([]),
    mitraIds: z.array(z.string().min(1)).default([]),
  })
  .refine((data) => data.pegawaiIds.length + data.mitraIds.length > 0, {
    message: 'Pilih minimal 1 petugas Organik atau Mitra Statistik',
    path: ['pegawaiIds'],
  })

export const verifikasiAlokasiSchema = z.object({
  status: z.enum(['DIAJUKAN', 'DISETUJUI', 'DITOLAK']),
  catatanVerifikasi: z.string().trim().max(300).optional(),
})

export const bulkApproveKegiatanSchema = z.object({
  status: z.enum(['DIAJUKAN', 'DISETUJUI', 'DITOLAK']),
})

export const createMitraSchema = z.object({
  nama: z.string().trim().min(2, 'Nama mitra minimal 2 karakter').max(150),
  sobatId: z.string().trim().max(50).optional(),
  noHp: z.string().trim().max(30).optional(),
  kecamatan: z.string().trim().max(100).optional(),
})
