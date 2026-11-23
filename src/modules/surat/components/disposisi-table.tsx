'use client'

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DisposisiItem } from '../types'

interface DisposisiTableProps {
  data: DisposisiItem[]
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDetailDisposisi?: (item: DisposisiItem) => void
  onEditDisposisi?: (item: DisposisiItem) => void
  onDeleteDisposisi?: (item: DisposisiItem) => void
}

function formatTanggal(tanggalIso: string) {
  const date = new Date(tanggalIso)
  if (Number.isNaN(date.getTime())) return tanggalIso

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function DisposisiTable({
  data,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onDetailDisposisi,
  onEditDisposisi,
  onDeleteDisposisi,
}: DisposisiTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b text-xs font-semibold text-foreground'>
              <th className='px-3 py-3'>Tanggal</th>
              <th className='px-3 py-3'>Surat</th>
              <th className='px-3 py-3'>Asal / Tujuan Surat</th>
              <th className='px-3 py-3'>Kepada</th>
              <th className='px-3 py-3'>Instruksi</th>
              <th className='px-3 py-3'>Dicatat Oleh</th>
              <th className='px-3 py-3 text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-3 py-8 text-center text-sm text-muted-foreground'
                >
                  Belum ada data disposisi yang sesuai.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className='transition-colors hover:bg-muted/40'
                >
                  <td className='whitespace-nowrap px-3 py-3.5 align-top text-foreground'>
                    {formatTanggal(item.tanggal)}
                  </td>
                  <td className='px-3 py-3.5 align-top'>
                    <div className='font-medium text-foreground'>
                      {item.nomorSurat}
                    </div>
                    <div className='max-w-56 text-xs text-muted-foreground'>
                      {item.perihalSurat}
                    </div>
                  </td>
                  <td className='max-w-48 px-3 py-3.5 align-top text-foreground'>
                    {item.dari}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3.5 align-top'>
                    <div className='font-medium text-foreground'>
                      {item.kepada}
                    </div>
                    {item.jabatanKepada && (
                      <div className='text-xs text-muted-foreground'>
                        {item.jabatanKepada}
                      </div>
                    )}
                  </td>
                  <td className='max-w-64 px-3 py-3.5 align-top text-foreground'>
                    {item.instruksi}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3.5 align-top text-foreground'>
                    {item.dicatatOleh}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3.5 text-center align-top'>
                    <div className='inline-flex items-center gap-1'>
                      {onDetailDisposisi && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-7 cursor-pointer'
                          title='Lihat Detail'
                          onClick={() => onDetailDisposisi(item)}
                        >
                          <Eye className='size-3.5' />
                        </Button>
                      )}
                      {onEditDisposisi && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-7 cursor-pointer text-amber-600 hover:text-amber-700'
                          title='Edit Disposisi'
                          onClick={() => onEditDisposisi(item)}
                        >
                          <Pencil className='size-3.5' />
                        </Button>
                      )}
                      {onDeleteDisposisi && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-7 cursor-pointer text-destructive hover:text-destructive'
                          title='Hapus Disposisi'
                          onClick={() => onDeleteDisposisi(item)}
                        >
                          <Trash2 className='size-3.5' />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          <span>Baris per halaman</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className='h-8 rounded-md border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring'
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>
            Menampilkan {startItem}–{endItem} dari {totalItems}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <div className='inline-flex items-center gap-1'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='size-7'
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className='size-3.5' />
            </Button>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='size-7'
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className='size-3.5' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
