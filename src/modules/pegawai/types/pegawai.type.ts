export type FungsiPegawai = {
  id: string
  nama: string
}

export type Pegawai = {
  id: string
  nama: string
  nip: string
  email: string | null
  nipBps: string
  golonganAkhir: string | null
  pangkat: string | null
  jabatan: string
  aktif: boolean
  fungsi: FungsiPegawai | null
  createdAt: string
  updatedAt: string
}

export type PegawaiResponse = {
  success: boolean
  message: string
  data: Pegawai[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}