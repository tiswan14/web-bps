import { apiClient } from '@/lib/api/client'
import type { PegawaiResponse } from '../types/pegawai.type'

export type PegawaiKategori = 'organik' | 'pengelola-anggaran'

export async function getPegawai(
  kategori: PegawaiKategori,
): Promise<PegawaiResponse> {
  const params = new URLSearchParams({ kategori })

  return apiClient<PegawaiResponse>(`/api/pegawai?${params.toString()}`)
}