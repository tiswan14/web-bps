
import type { PegawaiResponse } from '../types/pegawai-response.type'

export type GetPegawaiParams = {
  page?: number
  limit?: number
  search?: string
  signal?: AbortSignal
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export async function getPegawai({
  page = 1,
  limit = 10,
  search = '',
  signal,
}: GetPegawaiParams = {}): Promise<PegawaiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (search.trim()) {
    params.set('search', search.trim())
  }

  const response = await fetch(
    `${API_URL}/api/pegawai?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal,
    },
  )

  if (!response.ok) {
    throw new Error('Gagal mengambil data pegawai')
  }

  const result: PegawaiResponse = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return result
}
