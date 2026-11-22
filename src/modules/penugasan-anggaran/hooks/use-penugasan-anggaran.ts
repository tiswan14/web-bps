'use client'

import { useEffect, useState } from 'react'

import {
  getPenugasanAnggaran,
  type PenugasanAnggaran,
} from '../services/penugasan-anggaran.service'

export function usePenugasanAnggaran() {
  const [penugasan, setPenugasan] = useState<PenugasanAnggaran[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const data = await getPenugasanAnggaran()

        if (active) {
          setPenugasan(data)
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : 'Terjadi kesalahan saat mengambil data',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [])

  return {
    penugasan,
    loading,
    error,
  }
}
