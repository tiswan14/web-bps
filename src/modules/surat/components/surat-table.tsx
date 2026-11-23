'use client'

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { JenisSurat, SuratItem } from '../types'

interface SuratTableProps {
  data: SuratItem[]
  jenis?: JenisSurat
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onDetailSurat?: (surat: SuratItem) => void
  onEditSurat?: (surat: SuratItem) => void
  onDeleteSurat?: (surat: SuratItem) => void
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

export function SuratTable({
  data,
  jenis,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onDetailSurat,
  onEditSurat,
  onDeleteSurat,
}: SuratTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)
  const asalTujuanLabel =
    jenis === 'MASUK'
      ? 'Asal Surat'
      : jenis === 'KELUAR'
        ? 'Tujuan Surat'
        : 'Asal / Tujuan'

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b text-xs font-semibold text-foreground'>
              <th className='px-3 py-3'>Nomor / Tanggal</th>
              <th className='px-3 py-3'>{asalTujuanLabel}</th>
              <th className='px-3 py-3'>Perihal</th>
              <th className='px-3 py-3'>Sifat</th>
              <th className='px-3 py-3'>Pengantaran</th>
              <th className='px-3 py-3'>Status</th>
              <th className='px-3 py-3'>Dicatat Oleh</th>
              <th className='px-3 py-3 text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-3 py-8 text-center text-sm text-muted-foreground'
                >
                  Belum ada data{' '}
                  {jenis === 'MASUK'
                    ? 'surat masuk'
                    : jenis === 'KELUAR'
                      ? 'surat keluar'
                      : 'surat'}{' '}
                  yang sesuai.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const statusLower = item.status?.toLowerCase() || ''
                const isSelesai =
                  statusLower === 'sudah' || statusLower === 'selesai'

                return (
                  <tr
                    key={item.id}
                    className='transition-colors hover:bg-muted/40'
                  >
                    <td className='whitespace-nowrap px-3 py-3.5 align-top'>
                      <div className='font-medium text-foreground'>
                        {item.nomor}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {formatTanggal(item.tanggal)}
                      </div>
                    </td>

                    <td className='max-w-52 px-3 py-3.5 align-top text-foreground'>
                      {item.asalTujuan}
                    </td>

                    <td className='max-w-72 px-3 py-3.5 align-top text-foreground'>
                      {item.perihal}
                    </td>

                    <td className='whitespace-nowrap px-3 py-3.5 align-top'>
                      <span
                        className={
                          item.sifat === 'PENTING'
                            ? 'font-medium text-amber-700'
                            : 'text-foreground'
                        }
                      >
                        {item.sifat === 'PENTING' ? 'Penting' : 'Biasa'}
                      </span>
                    </td>

                    <td className='whitespace-nowrap px-3 py-3.5 align-top text-muted-foreground'>
                      {item.pengantaran || '—'}
                    </td>

                    <td className='whitespace-nowrap px-3 py-3.5 align-top'>
                      {item.status ? (
                        <div
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            isSelesai ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {isSelesai ? (
                            <CheckCircle2 className='size-3.5' />
                          ) : (
                            <Clock className='size-3.5' />
                          )}
                          {item.status}
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>—</span>
                      )}
                    </td>

                    <td className='whitespace-nowrap px-3 py-3.5 align-top text-foreground'>
                      {item.dicatatOleh}
                    </td>

                    <td className='whitespace-nowrap px-3 py-3.5 text-center align-top'>
                      <div className='inline-flex items-center gap-1'>
                        {onDetailSurat && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='size-7 cursor-pointer'
                            title='Lihat Detail'
                            onClick={() => onDetailSurat(item)}
                          >
                            <Eye className='size-3.5' />
                          </Button>
                        )}
                        {onEditSurat && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='size-7 cursor-pointer text-amber-600 hover:text-amber-700'
                            title='Edit Surat'
                            onClick={() => onEditSurat(item)}
                          >
                            <Pencil className='size-3.5' />
                          </Button>
                        )}
                        {onDeleteSurat && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='size-7 cursor-pointer text-destructive hover:text-destructive'
                            title='Hapus Surat'
                            onClick={() => onDeleteSurat(item)}
                          >
                            <Trash2 className='size-3.5' />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
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
