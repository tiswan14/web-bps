import type { JenisPengadaan, StatusPengadaan } from '../types'

export const DAFTAR_BULAN = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
] as const

export function getCurrentTahunAnggaran(): string {
  return String(new Date().getFullYear())
}

export function getDaftarTahunAnggaran(): string[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, idx) => String(currentYear - 1 + idx))
}

export const DAFTAR_TAHUN_ANGGARAN = getDaftarTahunAnggaran()

export const JENIS_PENGADAAN_LABEL: Record<JenisPengadaan, string> = {
  BARANG: 'Barang',
  JASA: 'Jasa',
}

export const DAFTAR_JENIS_DOKUMEN = [
  'E-Purchasing',
  'Pengadaan Langsung',
  'Swakelola',
  'Kuitansi / Bukti Pembelian',
  'SPK / Kontrak',
] as const

export const STATUS_PENGADAAN_CONFIG: Record<
  StatusPengadaan,
  {
    label: string
    badgeLabel: string
    badgeClass: string
  }
> = {
  DRAFT: {
    label: 'Draft',
    badgeLabel: 'Draft',
    badgeClass:
      'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  },
  USULAN: {
    label: 'Usulan',
    badgeLabel: 'Usulan',
    badgeClass:
      'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  },
  PROSES: {
    label: 'Proses',
    badgeLabel: 'Proses (PBJ)',
    badgeClass:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
  },
  KONTRAK: {
    label: 'Kontrak',
    badgeLabel: 'Kontrak',
    badgeClass:
      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800',
  },
  SELESAI: {
    label: 'Selesai',
    badgeLabel: 'Selesai',
    badgeClass:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
  },
  BATAL: {
    label: 'Batal',
    badgeLabel: 'Batal',
    badgeClass:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800',
  },
}

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal)
}

export function formatTanggalLengkap(dateStr?: string | null): string {
  if (!dateStr) return '-'
  const clean = dateStr.slice(0, 10)
  const [year, month, day] = clean.split('-')
  if (!year || !month || !day) return clean
  const bulanObj = DAFTAR_BULAN.find((b) => b.value === month)
  const namaBulan = bulanObj ? bulanObj.label : month
  return `${day.padStart(2, '0')} ${namaBulan} ${year}`
}
