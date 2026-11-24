import { apiClient } from '@/lib/api/client'
import type {
  CreatePengadaanInput,
  JenisPengadaan,
  PengadaanItem,
  StatusPengadaan,
  UpdatePengadaanInput,
} from '../types'

interface PengadaanApiRecord {
  id: string
  kodePengadaan: string
  tahunAnggaran: number
  tanggalUsulan: string
  jenisPengadaan: JenisPengadaan
  namaProduk: string
  detilPok: string
  kodePok: string
  status: StatusPengadaan
  rencana: number
  realisasi: number
  formPermintaan?: string | null
  linkKak?: string | null
  jenisDokumen?: string | null
  nomorDokumen?: string | null
  tanggalDokumen?: string | null
  namaPenyedia?: string | null
  tanggalPembayaran?: string | null
  nomorBuktiPembayaran?: string | null
  linkEpurchasing?: string | null
  keterangan?: string | null
  dicatatOleh?: string
  pencatat?: {
    id: string
    username: string
    email: string
  } | null
}

function mapRecordToPengadaanItem(
  record: PengadaanApiRecord,
): PengadaanItem {
  return {
    id: record.id,
    kodePengadaan: record.kodePengadaan,
    tahunAnggaran: record.tahunAnggaran,
    tanggalUsulan: record.tanggalUsulan.slice(0, 10),
    jenisPengadaan: record.jenisPengadaan,
    namaProduk: record.namaProduk,
    detilPok: record.detilPok,
    kodePok: record.kodePok,
    status: record.status,
    rencana: record.rencana,
    realisasi: record.realisasi,
    formPermintaan: record.formPermintaan ?? null,
    linkKak: record.linkKak ?? null,
    jenisDokumen: record.jenisDokumen ?? null,
    nomorDokumen: record.nomorDokumen ?? null,
    tanggalDokumen: record.tanggalDokumen
      ? record.tanggalDokumen.slice(0, 10)
      : null,
    namaPenyedia: record.namaPenyedia ?? null,
    tanggalPembayaran: record.tanggalPembayaran
      ? record.tanggalPembayaran.slice(0, 10)
      : null,
    nomorBuktiPembayaran: record.nomorBuktiPembayaran ?? null,
    linkEpurchasing: record.linkEpurchasing ?? null,
    keterangan: record.keterangan ?? null,
    dicatatOleh: record.pencatat?.username || record.dicatatOleh || '-',
  }
}

export async function fetchPengadaanList(params?: {
  bulan?: string
  tahun?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{
  items: PengadaanItem[]
  summary: { totalRencana: number; totalRealisasi: number }
  pagination: { page: number; limit: number; total: number; totalPages: number }
}> {
  const qs = new URLSearchParams()
  qs.set('page', String(params?.page ?? 1))
  qs.set('limit', String(params?.limit ?? 10))
  if (params?.bulan) qs.set('bulan', params.bulan)
  if (params?.tahun) qs.set('tahun', params.tahun)
  if (params?.status && params.status !== 'ALL') qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)

  const res = await apiClient<{
    success: boolean
    data: {
      data: PengadaanApiRecord[]
      summary: { totalRencana: number; totalRealisasi: number }
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }
  }>(`/api/pengadaan?${qs.toString()}`)

  const rawList = Array.isArray(res.data?.data) ? res.data.data : []

  return {
    items: rawList.map(mapRecordToPengadaanItem),
    summary: res.data?.summary ?? { totalRencana: 0, totalRealisasi: 0 },
    pagination: res.data?.pagination ?? {
      page: 1,
      limit: 10,
      total: rawList.length,
      totalPages: 1,
    },
  }
}

export async function postCreatePengadaan(
  payload: CreatePengadaanInput,
): Promise<PengadaanItem> {
  const res = await apiClient<{
    success: boolean
    data: PengadaanApiRecord
  }>('/api/pengadaan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToPengadaanItem(res.data)
}

export async function patchUpdatePengadaan(
  id: string,
  payload: UpdatePengadaanInput,
): Promise<PengadaanItem> {
  const res = await apiClient<{
    success: boolean
    data: PengadaanApiRecord
  }>(`/api/pengadaan/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToPengadaanItem(res.data)
}

export async function deletePengadaanById(id: string): Promise<void> {
  await apiClient(`/api/pengadaan/${id}`, {
    method: 'DELETE',
  })
}
