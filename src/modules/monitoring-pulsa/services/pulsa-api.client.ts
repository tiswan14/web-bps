import type {
  CreateAjuanPulsaInput,
  MasterMitraOption,
  MonitoringPulsaResponse,
  StatusPersetujuanPulsa,
  UpdateKegiatanPulsaInput,
} from '../types'

async function parseJson<T>(res: Response): Promise<T> {
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json?.error?.message ?? 'Terjadi kesalahan pada server.')
  }
  return json.data as T
}

export async function fetchMonitoringPulsa(
  bulan: number,
  tahun: number,
): Promise<MonitoringPulsaResponse> {
  const res = await fetch(
    `/api/pengadaan/monitoring-pulsa?bulan=${bulan}&tahun=${tahun}`,
    { cache: 'no-store' },
  )
  return parseJson<MonitoringPulsaResponse>(res)
}

export async function submitAjuanPulsa(input: CreateAjuanPulsaInput) {
  const res = await fetch('/api/pengadaan/monitoring-pulsa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseJson<{ id: string; message: string }>(res)
}

export async function updateKegiatanPulsaApi(
  kegiatanId: string,
  input: UpdateKegiatanPulsaInput,
) {
  const res = await fetch(
    `/api/pengadaan/monitoring-pulsa/kegiatan/${kegiatanId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  )
  return parseJson<{ message: string }>(res)
}

export async function bulkVerifyKegiatanApi(
  kegiatanId: string,
  status: StatusPersetujuanPulsa,
) {
  const res = await fetch(
    `/api/pengadaan/monitoring-pulsa/kegiatan/${kegiatanId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    },
  )
  return parseJson<{ message: string }>(res)
}

export async function deleteKegiatanPulsaApi(kegiatanId: string) {
  const res = await fetch(
    `/api/pengadaan/monitoring-pulsa/kegiatan/${kegiatanId}`,
    {
      method: 'DELETE',
    },
  )
  return parseJson<{ message: string }>(res)
}

export async function verifyAlokasiPulsaApi(
  alokasiId: string,
  status: StatusPersetujuanPulsa,
) {
  const res = await fetch(
    `/api/pengadaan/monitoring-pulsa/alokasi/${alokasiId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    },
  )
  return parseJson<{ message: string }>(res)
}

export async function createMitraQuickApi(input: {
  nama: string
  sobatId?: string
  noHp?: string
  kecamatan?: string
}) {
  const res = await fetch('/api/pengadaan/monitoring-pulsa/mitra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseJson<MasterMitraOption>(res)
}
