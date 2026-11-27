
'use client'

import {
  useTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  dataTableFeatures,
  type DataTableFeatures,
} from './data-table.config'

type DataTableColumnMeta = {
  headerClassName?: string
  cellClassName?: string
}

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  loading?: boolean
  emptyMessage?: string
  loadingMessage?: string
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function DataTable<TData extends RowData>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Tidak ada data ditemukan',
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    manualPagination: true,
    rowCount: total,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const current = {
        pageIndex: page - 1,
        pageSize: limit,
      }

      const next =
        typeof updater === 'function'
          ? updater(current)
          : updater

      if (next.pageIndex !== current.pageIndex) {
        onPageChange(next.pageIndex + 1)
      }

      if (next.pageSize !== current.pageSize) {
        onLimitChange(next.pageSize)
      }
    },
  })

  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows

  const startData = total === 0 ? 0 : (page - 1) * limit + 1
  const endData = Math.min(page * limit, total)

  const canPreviousPage = page > 1
  const canNextPage = page < totalPages

  return (
    <div className='overflow-hidden rounded-xl border border-border'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | DataTableColumnMeta
                    | undefined

                  return (
                    <TableHead
                      key={header.id}
                      className={meta?.headerClassName}
                    >
                      {header.isPlaceholder
                        ? null
                        : <table.FlexRender header={header} />}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-64'
                >
                  <div className='flex flex-col items-center justify-center gap-3'>
                    <div className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
                      <LoaderCircle className='size-6 animate-spin text-primary' />
                    </div>

                    <div className='space-y-1 text-center'>
                      <p className='text-sm font-medium'>
                        Sedang memuat data
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Mohon tunggu sebentar...
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center text-sm text-muted-foreground'
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | DataTableColumnMeta
                      | undefined

                    return (
                      <TableCell
                        key={cell.id}
                        className={meta?.cellClassName}
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && (
        <div className='flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4'>
            <p>
              Menampilkan{' '}
              <span className='font-medium text-foreground'>
                {startData}–{endData}
              </span>{' '}
              dari{' '}
              <span className='font-medium text-foreground'>
                {total}
              </span>{' '}
              data
            </p>

            <div className='flex items-center gap-2'>
              <label htmlFor='page-size'>Baris per halaman</label>

              <select
                id='page-size'
                value={limit}
                onChange={(event) =>
                  onLimitChange(Number(event.target.value))
                }
                className='h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex items-center justify-between gap-2 sm:justify-end'>
            <p className='text-sm text-muted-foreground'>
              Halaman{' '}
              <span className='font-medium text-foreground'>
                {totalPages === 0 ? 0 : page}
              </span>{' '}
              dari{' '}
              <span className='font-medium text-foreground'>
                {totalPages}
              </span>
            </p>

            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => onPageChange(1)}
                disabled={loading || !canPreviousPage}
                aria-label='Halaman pertama'
              >
                <ChevronsLeft className='size-4' />
              </Button>

              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => onPageChange(page - 1)}
                disabled={loading || !canPreviousPage}
                aria-label='Halaman sebelumnya'
              >
                <ChevronLeft className='size-4' />
              </Button>

              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => onPageChange(page + 1)}
                disabled={loading || !canNextPage}
                aria-label='Halaman berikutnya'
              >
                <ChevronRight className='size-4' />
              </Button>

              <Button
                variant='outline'
                size='icon'
                className='size-8'
                onClick={() => onPageChange(totalPages)}
                disabled={loading || !canNextPage}
                aria-label='Halaman terakhir'
              >
                <ChevronsRight className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
