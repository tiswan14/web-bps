import { apiClient } from '@/lib/api/client'
import type {
  CreateSuratInput,
  JenisSurat,
  SuratApiRecord,
  SuratItem,
  SuratListResponse,
  SuratMutationResponse,
  UpdateSuratInput,
} from '../types'

function mapRecordToSuratItem(record: SuratApiRecord): SuratItem {
  return {
    id: record.id,
    jenis: record.jenis,
    nomor: record.nomor,
    tanggal: record.tanggal,
    asalTujuan: record.asalTujuan,
    perihal: record.perihal,
    sifat: record.sifat,
    pengantaran: record.pengantaran ?? null,
    status: record.status ?? null,
    periodeId: record.periodeId,
    penerimaDisposisi: null,
    dicatatOleh: record.pencatat?.username || record.dicatatOleh || '-',
  }
}

export async function fetchSuratList(params: {
  page: number
  limit: number
  search?: string
  jenis?: JenisSurat
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  })

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  if (params.jenis) {
    query.set('jenis', params.jenis)
  }

  const res = await apiClient<SuratListResponse>(
    `/api/surat?${query.toString()}`,
  )

  return {
    items: res.data.data.map(mapRecordToSuratItem),
    meta: res.data.meta,
  }
}

export async function postCreateSurat(
  payload: CreateSuratInput,
): Promise<SuratItem> {
  const res = await apiClient<SuratMutationResponse>('/api/surat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToSuratItem(res.data)
}

export async function patchUpdateSurat(
  id: string,
  payload: UpdateSuratInput,
): Promise<SuratItem> {
  const res = await apiClient<SuratMutationResponse>(`/api/surat/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToSuratItem(res.data)
}

export async function deleteSuratById(id: string): Promise<void> {
  await apiClient(`/api/surat/${id}`, {
    method: 'DELETE',
  })
}
