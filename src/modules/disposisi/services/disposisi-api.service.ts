import { apiClient } from '@/lib/api/client'
import type {
  CreateDisposisiInput,
  DisposisiApiRecord,
  DisposisiItem,
  DisposisiMutationResponse,
  PegawaiOption,
  UpdateDisposisiInput,
} from '@/modules/surat/types'

function mapRecordToDisposisiItem(record: DisposisiApiRecord): DisposisiItem {
  return {
    id: record.id,
    suratId: record.suratId,
    kepadaPegawaiId: record.kepadaPegawaiId,
    tanggal: record.tanggal,
    nomorSurat: record.surat?.nomor || '-',
    jenisSurat: record.surat?.jenis || 'MASUK',
    perihalSurat: record.surat?.perihal || '-',
    dari: record.surat?.asalTujuan || '-',
    kepada: record.kepada?.nama || '-',
    jabatanKepada: record.kepada?.jabatan ?? null,
    nipKepada: record.kepada?.nip ?? null,
    instruksi: record.instruksi,
    dicatatOleh: record.pencatat?.username || record.dicatatOleh || '-',
  }
}

export async function fetchDisposisiList(params: {
  page: number
  limit: number
  search?: string
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  })

  if (params.search?.trim()) {
    query.set('search', params.search.trim())
  }

  const res = await apiClient<Record<string, unknown>>(
    `/api/disposisi?${query.toString()}`,
  )

  const dataField = res.data as
    | DisposisiApiRecord[]
    | {
        data?: DisposisiApiRecord[]
        pagination?: {
          page: number
          limit: number
          total: number
          totalPages: number
        }
        meta?: {
          page: number
          limit: number
          total: number
          totalPages: number
        }
      }
    | undefined

  const rawList: DisposisiApiRecord[] = Array.isArray(dataField)
    ? dataField
    : Array.isArray(dataField?.data)
      ? dataField.data
      : []

  const topPagination = res.pagination as
    | { page: number; limit: number; total: number; totalPages: number }
    | undefined

  const nestedPagination =
    !Array.isArray(dataField) && dataField
      ? (dataField.pagination ?? dataField.meta)
      : undefined

  const pagination = topPagination ??
    nestedPagination ?? {
      page: params.page,
      limit: params.limit,
      total: rawList.length,
      totalPages: Math.max(1, Math.ceil(rawList.length / params.limit)),
    }

  return {
    items: rawList.map(mapRecordToDisposisiItem),
    pagination,
  }
}

export async function postCreateDisposisi(
  payload: CreateDisposisiInput,
): Promise<DisposisiItem> {
  const res = await apiClient<DisposisiMutationResponse>('/api/disposisi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return mapRecordToDisposisiItem(res.data)
}

export async function patchUpdateDisposisi(
  id: string,
  payload: UpdateDisposisiInput,
): Promise<DisposisiItem> {
  const res = await apiClient<DisposisiMutationResponse>(
    `/api/disposisi/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )

  return mapRecordToDisposisiItem(res.data)
}

export async function deleteDisposisiById(id: string): Promise<void> {
  await apiClient(`/api/disposisi/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchPegawaiAktifOptions(): Promise<PegawaiOption[]> {
  const res = await apiClient<{
    success: boolean
    data: PegawaiOption[] | { data: PegawaiOption[] }
  }>('/api/pegawai?limit=50')

  const list = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
      ? res.data.data
      : []

  return list.filter((p) => p.aktif !== false)
}
