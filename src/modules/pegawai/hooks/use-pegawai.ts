
'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  getPegawai,
  type PegawaiKategori,
} from '../services/pegawai.service'
import type { PegawaiResponse } from '../types/pegawai.type'

export function usePegawai(kategori: PegawaiKategori) {
  const [data, setData] = useState<PegawaiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPegawai = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getPegawai(kategori)
      setData(result)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data pegawai',
      )
    } finally {
      setLoading(false)
    }
  }, [kategori])

  useEffect(() => {
    let active = true

    getPegawai(kategori)
      .then((result) => {
        if (active) {
          setData(result)
          setError(null)
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : 'Gagal mengambil data pegawai',
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [kategori])

  return {
    pegawai: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading,
    error,
    refresh: fetchPegawai,
  }
}
