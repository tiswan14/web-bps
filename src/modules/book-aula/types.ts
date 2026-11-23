export interface RuangAula {
  id: string
  nama: string
  kapasitas: number
  keterangan?: string
}

export interface BookingAulaItem {
  id: string
  ruangId: string
  namaRuang: string
  tanggal: string // format YYYY-MM-DD
  jamMulai: string // format HH:mm
  jamSelesai: string // format HH:mm
  namaPeminjam: string
  jumlahPeserta: number
  kegiatan: string
  dicatatOleh: string
}

export interface CreateBookingAulaInput {
  ruangId: string
  tanggal: string
  jamMulai: string
  jamSelesai: string
  namaPeminjam: string
  jumlahPeserta: number
  kegiatan: string
}

export type UpdateBookingAulaInput = Partial<CreateBookingAulaInput>
