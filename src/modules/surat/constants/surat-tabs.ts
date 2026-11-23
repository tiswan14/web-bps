import type { JenisSurat } from '@/modules/surat/types'

export type TabSurat = 'surat-masuk' | 'surat-keluar' | 'disposisi'

interface TabConfig {
  label: string
  title: string
  description: string
  addLabel: string
  searchPlaceholder: string
  loadingLabel: string
  jenis: JenisSurat
}

export const TAB_CONFIG: Record<TabSurat, TabConfig> = {
  'surat-masuk': {
    label: 'Surat Masuk',
    title: 'Daftar Surat Masuk',
    description: 'Catat dan kelola surat masuk yang diterima instansi.',
    addLabel: 'Catat Surat Masuk',
    searchPlaceholder: 'Cari nomor, asal surat, atau perihal...',
    loadingLabel: 'Memuat data surat masuk...',
    jenis: 'MASUK',
  },
  'surat-keluar': {
    label: 'Surat Keluar',
    title: 'Daftar Surat Keluar',
    description:
      'Catat dan kelola surat keluar yang dikirim atau diantarkan secara fisik.',
    addLabel: 'Catat Surat Keluar',
    searchPlaceholder: 'Cari nomor, tujuan surat, atau perihal...',
    loadingLabel: 'Memuat data surat keluar...',
    jenis: 'KELUAR',
  },
  disposisi: {
    label: 'Disposisi',
    title: 'Daftar Disposisi',
    description: 'Daftar penerusan disposisi surat masuk dan keluar internal.',
    addLabel: 'Buat Disposisi',
    searchPlaceholder: 'Cari nomor surat, perihal, atau penerima...',
    loadingLabel: 'Memuat data disposisi...',
    jenis: 'MASUK', // tidak dipakai di tab disposisi
  },
}

export const TAB_ORDER: TabSurat[] = ['surat-masuk', 'surat-keluar', 'disposisi']
