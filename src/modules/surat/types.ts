export type JenisSurat = 'MASUK' | 'KELUAR'

export type SifatSurat = 'BIASA' | 'PENTING'

export interface SuratItem {
  id: string
  jenis: JenisSurat
  nomor: string
  tanggal: string
  asalTujuan: string
  perihal: string
  sifat: SifatSurat
  pengantaran: string | null
  status: string | null
  periodeId?: number
  penerimaDisposisi?: string | null
  dicatatOleh: string
}

export interface CreateSuratInput {
  jenis: JenisSurat
  nomor: string
  tanggal: string
  asalTujuan: string
  perihal: string
  sifat: SifatSurat
  pengantaran: string | null
  status: string | null
  periodeId: number
}

export type UpdateSuratInput = Partial<CreateSuratInput>

export interface SuratApiRecord {
  id: string
  jenis: JenisSurat
  nomor: string
  tanggal: string
  asalTujuan: string
  perihal: string
  sifat: SifatSurat
  pengantaran: string | null
  status: string | null
  dicatatOleh: string
  periodeId: number
  pencatat?: {
    id: string
    username: string
    email: string
  } | null
}

export interface SuratListResponse {
  success: boolean
  message: string
  data: {
    data: SuratApiRecord[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface SuratMutationResponse {
  success: boolean
  message: string
  data: SuratApiRecord
}

export interface DisposisiItem {
  id: string
  suratId: string
  kepadaPegawaiId: string
  tanggal: string
  nomorSurat: string
  jenisSurat: JenisSurat
  perihalSurat: string
  dari: string
  kepada: string
  jabatanKepada: string | null
  nipKepada: string | null
  instruksi: string
  dicatatOleh: string
}

export interface CreateDisposisiInput {
  suratId: string
  kepadaPegawaiId: string
  instruksi: string
  tanggal: string
}

export type UpdateDisposisiInput = Partial<CreateDisposisiInput>

export interface DisposisiApiRecord {
  id: string
  suratId: string
  kepadaPegawaiId: string
  dicatatOleh: string
  instruksi: string
  tanggal: string
  surat: {
    id: string
    nomor: string
    jenis: JenisSurat
    tanggal: string
    asalTujuan: string
    perihal: string
  }
  kepada: {
    id: string
    nama: string
    nip: string | null
    jabatan: string | null
    aktif: boolean
  }
  pencatat?: {
    id: string
    username: string
    email: string
  } | null
}

export interface DisposisiListResponse {
  success: boolean
  message: string
  data: {
    data: DisposisiApiRecord[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface DisposisiMutationResponse {
  success: boolean
  message: string
  data: DisposisiApiRecord
}

export interface PegawaiOption {
  id: string
  nama: string
  nip: string | null
  jabatan: string | null
  aktif: boolean
}
