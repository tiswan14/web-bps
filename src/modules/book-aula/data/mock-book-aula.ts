import type { BookingAulaItem, RuangAula } from '../types'

export const DAFTAR_RUANG_AULA: RuangAula[] = [
  {
    id: 'aula-sinergi',
    nama: 'Aula Sinergi',
    kapasitas: 40,
    keterangan: 'Ruang pertemuan utama untuk rapat besar & pelatihan',
  },
  {
    id: 'ruang-kolaborasi',
    nama: 'Ruang Kolaborasi',
    kapasitas: 10,
    keterangan: 'Ruang diskusi tim & rapat koordinasi kecil',
  },
]

export const INITIAL_BOOKING_AULA: BookingAulaItem[] = [
  {
    id: 'book-1',
    ruangId: 'aula-sinergi',
    namaRuang: 'Aula Sinergi',
    tanggal: '2026-11-23',
    jamMulai: '08:00',
    jamSelesai: '16:00',
    namaPeminjam: 'Hafizh Meyzar Aqil, SST, M.Sc.',
    jumlahPeserta: 27,
    kegiatan: 'Pelatihan Petugas Pengolahan SPKRT 2027',
    dicatatOleh: 'admin',
  },
  {
    id: 'book-2',
    ruangId: 'ruang-kolaborasi',
    namaRuang: 'Ruang Kolaborasi',
    tanggal: '2026-11-25',
    jamMulai: '09:00',
    jamSelesai: '11:30',
    namaPeminjam: 'Kevin Firmansyah',
    jumlahPeserta: 8,
    kegiatan: 'Rapat Evaluasi Desa Cinta Statistik (Desa Cantik)',
    dicatatOleh: 'admin',
  },
]

export function toMinutes(timeStr: string): number {
  const [hh, mm] = timeStr.split(':').map(Number)
  return (hh || 0) * 60 + (mm || 0)
}

export function cekBentrokJadwal(
  list: BookingAulaItem[],
  candidate: {
    ruangId: string
    tanggal: string
    jamMulai: string
    jamSelesai: string
  },
  ignoreId?: string,
): BookingAulaItem | undefined {
  const startNew = toMinutes(candidate.jamMulai)
  const endNew = toMinutes(candidate.jamSelesai)

  return list.find((item) => {
    if (ignoreId && item.id === ignoreId) return false
    if (item.ruangId !== candidate.ruangId) return false
    if (item.tanggal !== candidate.tanggal) return false

    const startExisting = toMinutes(item.jamMulai)
    const endExisting = toMinutes(item.jamSelesai)

    return startNew < endExisting && endNew > startExisting
  })
}
