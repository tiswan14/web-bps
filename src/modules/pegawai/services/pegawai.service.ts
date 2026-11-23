
import { apiClient } from '@/lib/api/client'
import type { Pegawai, PegawaiResponse } from '../types/pegawai.type'

export type PegawaiKategori = 'organik' | 'pengelola-anggaran'

export type PegawaiInput = {
  nama: string
  nip: string
  email: string
  nipBps: string
  golonganAkhir: string
  pangkat: string
  jabatan: string
}

type PegawaiMutationResponse = {
  success: boolean
  message: string
  data: Pegawai
}

export async function getPegawai(
  kategori: PegawaiKategori,
): Promise<PegawaiResponse> {
  const params = new URLSearchParams({ kategori })

  return apiClient<PegawaiResponse>(
    `/api/pegawai?${params.toString()}`,
  )
}

export async function createPegawai(
  payload: PegawaiInput,
): Promise<PegawaiMutationResponse> {
  return apiClient<PegawaiMutationResponse>('/api/pegawai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function updatePegawai(
  id: string,
  payload: Partial<PegawaiInput>,
): Promise<PegawaiMutationResponse> {
  return apiClient<PegawaiMutationResponse>(`/api/pegawai/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function deactivatePegawai(
  id: string,
): Promise<PegawaiMutationResponse> {
  return apiClient<PegawaiMutationResponse>(`/api/pegawai/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ aktif: false }),
  })
}
