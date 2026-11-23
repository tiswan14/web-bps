import { apiClient } from '@/lib/api/client'
import type {
  BookingAulaItem,
  CreateBookingAulaInput,
  UpdateBookingAulaInput,
} from '../types'

interface BookingAulaApiRecord {
  id: string
  ruangId: string
  namaRuang: string
  tanggal: string
  jamMulai: string
  jamSelesai: string
  namaPeminjam: string
  jumlahPeserta: number
  kegiatan: string
  dicatatOleh: string
  pencatat?: {
    id: string
    username: string
    email: string
  } | null
}

function mapRecordToBookingItem(
  record: BookingAulaApiRecord,
): BookingAulaItem {
  return {
    id: record.id,
    ruangId: record.ruangId,
    namaRuang: record.namaRuang,
    tanggal: record.tanggal.slice(0, 10),
    jamMulai: record.jamMulai,
    jamSelesai: record.jamSelesai,
    namaPeminjam: record.namaPeminjam,
    jumlahPeserta: record.jumlahPeserta,
    kegiatan: record.kegiatan,
    dicatatOleh: record.pencatat?.username || record.dicatatOleh || '-',
  }
}

export async function fetchBookAulaList(): Promise<BookingAulaItem[]> {
  const res = await apiClient<{
    success: boolean
    data: {
      data: BookingAulaApiRecord[]
    }
  }>('/api/book-aula?limit=500')

  const list = Array.isArray(res.data?.data) ? res.data.data : []
  return list.map(mapRecordToBookingItem)
}

export async function postCreateBookAula(
  payload: CreateBookingAulaInput,
): Promise<BookingAulaItem> {
  const res = await apiClient<{
    success: boolean
    data: BookingAulaApiRecord
  }>('/api/book-aula', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToBookingItem(res.data)
}

export async function patchUpdateBookAula(
  id: string,
  payload: UpdateBookingAulaInput,
): Promise<BookingAulaItem> {
  const res = await apiClient<{
    success: boolean
    data: BookingAulaApiRecord
  }>(`/api/book-aula/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToBookingItem(res.data)
}

export async function deleteBookAulaById(id: string): Promise<void> {
  await apiClient(`/api/book-aula/${id}`, {
    method: 'DELETE',
  })
}
