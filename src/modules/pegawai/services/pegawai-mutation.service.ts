
import type { Pegawai } from '../types/pegawai.type'

export type PegawaiAccountPayload = {
  username: string
  emailAkun: string
  password: string
}

export type PegawaiPayload = Omit<
  Pegawai,
  'id' | 'createdAt' | 'updatedAt'
>

export type CreatePegawaiPayload = PegawaiPayload & PegawaiAccountPayload

export type PegawaiDetail = Pegawai & {
  pendidikan: string | null
  email: string | null
  noHp: string | null
  npwp: string | null
  rekening: string | null
  bank: string | null
  linkSkJabatan: string | null
  linkSkPangkat: string | null
  foto: string | null
  user: {
    id: string
    username: string
    email: string
    role: 'ADMIN' | 'OPERATOR' | 'PEGAWAI' | 'BENDAHARA' | 'PPK'
    isActive: boolean
  } | null
}

export type UpdatePegawaiPayload = PegawaiPayload & {
  pendidikan: string | null
  email: string | null
  noHp: string | null
  npwp: string | null
  rekening: string | null
  bank: string | null
  linkSkJabatan: string | null
  linkSkPangkat: string | null
  foto: string | null
  username?: string
  emailAkun?: string
  password?: string
  isActive?: boolean
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const result = await response.json() as ApiResponse<T>

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Terjadi kesalahan pada server')
  }

  return result.data
}

export function createPegawai(payload: CreatePegawaiPayload) {
  return request<{ pegawai: Pegawai; user: unknown }>('/api/pegawai', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getPegawaiById(id: string) {
  return request<PegawaiDetail>(`/api/pegawai/${id}`)
}

export function updatePegawai(
  id: string,
  payload: UpdatePegawaiPayload,
) {
  return request<PegawaiDetail>(`/api/pegawai/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deletePegawai(id: string) {
  return request<Pegawai>(`/api/pegawai/${id}`, {
    method: 'DELETE',
  })
}
