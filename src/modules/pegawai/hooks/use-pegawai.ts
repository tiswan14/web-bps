
'use client'

import { useCallback, useEffect, useState } from 'react'

import { getPegawai } from '../services/pegawai.service'
import type { Pegawai } from '../types/pegawai.type'

export function usePegawai() {
  const [data, setData] = useState<Pegawai[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPageState] = useState(1)
  const [limit, setLimitState] = useState(10)
  const [search, setSearchState] = useState('')

  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const response = await getPegawai({
          page,
          limit,
          search,
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        setData(response.data)
        setTotal(response.pagination.total)
        setTotalPages(response.pagination.totalPages)
      } catch (error) {
        if (controller.signal.aborted) return

        setError(
          error instanceof Error
            ? error.message
            : 'Gagal mengambil data pegawai',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => controller.abort()
  }, [page, limit, search])

  const handleSearch = useCallback((value: string) => {
    setSearchState(value)
    setPageState(1)
  }, [])

  const handlePageChange = useCallback((value: number) => {
    setPageState(value)
  }, [])

  const handleLimitChange = useCallback((value: number) => {
    setLimitState(value)
    setPageState(1)
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPegawai({
        page,
        limit,
        search,
      })

      setData(response.data)
      setTotal(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Gagal mengambil data pegawai',
      )
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  return {
    data,
    loading,
    error,
    page,
    limit,
    search,
    total,
    totalPages,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    setSearch: handleSearch,
    refetch,
  }
}
