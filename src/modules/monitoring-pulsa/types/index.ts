export type TipePetugasPulsa = 'ORGANIK' | 'MITRA'
export type StatusPersetujuanPulsa = 'DIAJUKAN' | 'DISETUJUI' | 'DITOLAK'

export interface MasterPegawaiOption {
  id: string
  nama: string
  nip: string
  jabatan: string | null
}

export interface MasterMitraOption {
  id: string
  nama: string
  sobatId: string | null
  noHp: string | null
  kecamatan: string | null
}

export interface PulsaAlokasiDetail {
  id: string
  kegiatanId: string
  namaKegiatan: string
  tipePetugas: TipePetugasPulsa
  petugasId: string
  namaPetugas: string
  nominal: number
  status: StatusPersetujuanPulsa
  catatanVerifikasi: string | null
  diverifikasiAt: string | null
}

export interface PulsaKegiatanItem {
  id: string
  bulan: number
  tahun: number
  namaKegiatan: string
  nominalPerOrang: number
  keterangan: string | null
  jumlahPetugas: number
  jumlahDisetujui: number
  totalAjuan: number
  totalDisetujui: number
  alokasi: PulsaAlokasiDetail[]
}

export interface PulsaPetugasRow {
  key: string
  petugasId: string
  nama: string
  tipe: TipePetugasPulsa
  isDuplikasi: boolean
  jumlahKegiatan: number
  kegiatanMap: Record<string, PulsaAlokasiDetail>
  daftarAlokasi: PulsaAlokasiDetail[]
  totalAjuan: number
  totalDisetujui: number
  statusKeseluruhan: 'SEMUA_DISETUJUI' | 'SEBAGIAN_DISETUJUI' | 'MENUNGGU' | 'DITOLAK'
}

export interface MonitoringPulsaSummary {
  totalPetugas: number
  totalOrganik: number
  totalMitra: number
  totalKegiatan: number
  totalAlokasi: number
  totalDisetujuiOrg: number
  totalNominalAjuan: number
  totalDisetujuiPpk: number
  terbilangDisetujui: string
}

export interface MonitoringPulsaResponse {
  periode: {
    bulan: number
    tahun: number
    label: string
  }
  currentUserRole: string
  canManage: boolean
  canApprove: boolean
  summary: MonitoringPulsaSummary
  kegiatanList: PulsaKegiatanItem[]
  petugasRows: PulsaPetugasRow[]
  masterPegawai: MasterPegawaiOption[]
  masterMitra: MasterMitraOption[]
}

export interface CreateAjuanPulsaInput {
  bulan: number
  tahun: number
  namaKegiatan: string
  nominalPerOrang: number
  keterangan?: string
  pegawaiIds: string[]
  mitraIds: string[]
}

export interface UpdateKegiatanPulsaInput {
  namaKegiatan: string
  nominalPerOrang: number
  keterangan?: string
  pegawaiIds: string[]
  mitraIds: string[]
}
