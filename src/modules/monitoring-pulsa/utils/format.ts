export const DAFTAR_BULAN_PULSA = [
  { value: 1, short: 'Jan', label: 'Januari' },
  { value: 2, short: 'Feb', label: 'Februari' },
  { value: 3, short: 'Mar', label: 'Maret' },
  { value: 4, short: 'Apr', label: 'April' },
  { value: 5, short: 'Mei', label: 'Mei' },
  { value: 6, short: 'Jun', label: 'Juni' },
  { value: 7, short: 'Jul', label: 'Juli' },
  { value: 8, short: 'Agu', label: 'Agustus' },
  { value: 9, short: 'Sep', label: 'September' },
  { value: 10, short: 'Okt', label: 'Oktober' },
  { value: 11, short: 'Nov', label: 'November' },
  { value: 12, short: 'Des', label: 'Desember' },
] as const

export function getNamaBulan(bulan: number): string {
  return DAFTAR_BULAN_PULSA.find((b) => b.value === bulan)?.label ?? String(bulan)
}

export function getRealtimeYearOptions(): number[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, idx) => currentYear - 1 + idx)
}

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal)
}

const SATUAN = [
  '',
  'Satu',
  'Dua',
  'Tiga',
  'Empat',
  'Lima',
  'Enam',
  'Tujuh',
  'Delapan',
  'Sembilan',
  'Sepuluh',
  'Sebelas',
]

function angkaKeKata(n: number): string {
  const num = Math.floor(Math.abs(n))
  if (num < 12) return SATUAN[num]
  if (num < 20) return `${angkaKeKata(num - 10)} Belas`
  if (num < 100) {
    return `${angkaKeKata(Math.floor(num / 10))} Puluh ${angkaKeKata(num % 10)}`.trim()
  }
  if (num < 200) return `Seratus ${angkaKeKata(num - 100)}`.trim()
  if (num < 1000) {
    return `${angkaKeKata(Math.floor(num / 100))} Ratus ${angkaKeKata(num % 100)}`.trim()
  }
  if (num < 2000) return `Seribu ${angkaKeKata(num - 1000)}`.trim()
  if (num < 1_000_000) {
    return `${angkaKeKata(Math.floor(num / 1000))} Ribu ${angkaKeKata(num % 1000)}`.trim()
  }
  if (num < 1_000_000_000) {
    return `${angkaKeKata(Math.floor(num / 1_000_000))} Juta ${angkaKeKata(num % 1_000_000)}`.trim()
  }
  if (num < 1_000_000_000_000) {
    return `${angkaKeKata(Math.floor(num / 1_000_000_000))} Miliar ${angkaKeKata(num % 1_000_000_000)}`.trim()
  }
  return String(num)
}

export function terbilangRupiah(nominal: number): string {
  if (!nominal || nominal <= 0) return 'Nol Rupiah'
  return `${angkaKeKata(nominal).replace(/\s+/g, ' ').trim()} Rupiah`
}
