export type JenisPenugasanAnggaran =
  | 'KUASA_PENGGUNA_ANGGARAN'
  | 'PEJABAT_PENANDATANGAN_SURAT_PERINTAH_MEMBAYAR'
  | 'PEJABAT_PEMBUAT_KOMITMEN'
  | 'PEJABAT_PENGADAAN_BARANG_DAN_JASA'
  | 'BENDAHARA_PENGELUARAN'

export interface PenugasanAnggaran {
  id: string
  pegawaiId: string
  periodeId: number
  jenis: JenisPenugasanAnggaran
  pegawai: {
    nipBps: unknown
    id: string
    nama: string
    nip: string
    jabatan: string | null
  }
  periode: {
    tahun: number
  }
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export async function getPenugasanAnggaran(): Promise<PenugasanAnggaran[]> {
  const response = await fetch('/api/penugasan-anggaran', {
    cache: 'no-store',
  })

  const result: ApiResponse<PenugasanAnggaran[]> = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Gagal mengambil data penugasan anggaran')
  }

  return result.data
}
