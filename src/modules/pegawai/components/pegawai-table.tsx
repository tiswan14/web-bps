
'use client'

import { useEffect, useMemo } from 'react'

import { DataTable } from '@/components/shared/data-table/data-table'
import { usePegawai } from '../hooks/use-pegawai'
import type { Pegawai } from '../types/pegawai.type'
import { getPegawaiColumns } from './columns'

type PegawaiTableProps = {
  search?: string
  onDetail: (pegawai: Pegawai) => void
  onEdit: (pegawai: Pegawai) => void
  onDelete: (pegawai: Pegawai) => void
}

export function PegawaiTable({
  search = '',
  onDetail,
  onEdit,
  onDelete,
}: PegawaiTableProps) {
  const {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    search: currentSearch,
    setPage,
    setLimit,
    setSearch,
  } = usePegawai()

  // Sinkronisasi pencarian dari komponen parent
  useEffect(() => {
    if (search !== currentSearch) {
      setSearch(search)
    }
  }, [search, currentSearch, setSearch])

  // Kolom tabel
  const columns = useMemo(
    () =>
      getPegawaiColumns({
        onDetail,
        onEdit,
        onDelete,
        page,
        limit,
      }),
    [onDetail, onEdit, onDelete, page, limit],
  )

  if (error) {
    return (
      <p className='text-sm text-destructive'>
        {error}
      </p>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage='Tidak ada data pegawai'
      loadingMessage='Memuat data pegawai...'
      page={page}
      limit={limit}
      total={total}
      totalPages={totalPages}
      onPageChange={setPage}
      onLimitChange={setLimit}
    />
  )
}
