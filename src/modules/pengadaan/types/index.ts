export type JenisPengadaan = 'BARANG' | 'JASA'

export type StatusPengadaan =
  | 'DRAFT'
  | 'USULAN'
  | 'PROSES'
  | 'KONTRAK'
  | 'SELESAI'
  | 'BATAL'

export interface PengadaanItem {
  id: string
  kodePengadaan: string
  tahunAnggaran: number
  tanggalUsulan: string // YYYY-MM-DD
  jenisPengadaan: JenisPengadaan
  namaProduk: string
  detilPok: string
  kodePok: string
  status: StatusPengadaan

  // Informasi Keuangan
  rencana: number
  realisasi: number

  // Dokumen & Realisasi
  formPermintaan?: string | null
  linkKak?: string | null
  jenisDokumen?: string | null
  nomorDokumen?: string | null
  tanggalDokumen?: string | null
  namaPenyedia?: string | null
  tanggalPembayaran?: string | null
  nomorBuktiPembayaran?: string | null
  linkEpurchasing?: string | null
  keterangan?: string | null
  dicatatOleh?: string
}

export interface CreatePengadaanInput {
  tanggalUsulan: string
  jenisPengadaan: JenisPengadaan
  namaProduk: string
  detilPok: string
  kodePok: string
  status: StatusPengadaan
  rencana: number
  realisasi: number
  formPermintaan?: string | null
  linkKak?: string | null
  jenisDokumen?: string | null
  nomorDokumen?: string | null
  tanggalDokumen?: string | null
  namaPenyedia?: string | null
  tanggalPembayaran?: string | null
  nomorBuktiPembayaran?: string | null
  linkEpurchasing?: string | null
  keterangan?: string | null
}

export type UpdatePengadaanInput = Partial<CreatePengadaanInput>
