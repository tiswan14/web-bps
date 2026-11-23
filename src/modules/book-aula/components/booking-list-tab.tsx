'use client'

import { useMemo, useState } from 'react'
import { Eye, Pencil, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BookingAulaItem } from '../types'

interface BookingListTabProps {
  data: BookingAulaItem[]
  onDetail: (item: BookingAulaItem) => void
  onEdit: (item: BookingAulaItem) => void
  onDelete: (item: BookingAulaItem) => void
}

function formatTanggalPendek(tanggalIso: string) {
  const date = new Date(`${tanggalIso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return tanggalIso

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function BookingListTab({
  data,
  onDetail,
  onEdit,
  onDelete,
}: BookingListTabProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase()
    const sorted = [...data].sort((a, b) => {
      if (a.tanggal !== b.tanggal) return b.tanggal.localeCompare(a.tanggal)
      return a.jamMulai.localeCompare(b.jamMulai)
    })

    if (!q) return sorted

    return sorted.filter(
      (item) =>
        item.kegiatan.toLowerCase().includes(q) ||
        item.namaPeminjam.toLowerCase().includes(q) ||
        item.namaRuang.toLowerCase().includes(q),
    )
  }, [data, search])

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

  const startItem = totalItems === 0 ? 0 : startIndex + 1
  const endItem = Math.min(safePage * pageSize, totalItems)

  return (
    <div className='space-y-5 rounded-xl border bg-card p-6 shadow-sm'>
      <div>
        <h2 className='text-lg font-semibold text-foreground'>
          Jadwal Pemesanan
        </h2>
        <p className='text-xs text-muted-foreground'>
          Hanya pemesanan aktif yang ditampilkan. Jadwal bentrok pada ruang yang
          sama tidak dapat disimpan.
        </p>
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative w-full sm:max-w-xs'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder='Cari kegiatan atau nama pemesan...'
            className='pl-9'
          />
        </div>

        <span className='text-xs text-muted-foreground'>
          {totalItems} pemesanan
        </span>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b text-xs font-semibold text-foreground'>
              <th className='px-3 py-3'>Tanggal &amp; Waktu</th>
              <th className='px-3 py-3'>Ruang</th>
              <th className='px-3 py-3'>Nama Peminjam</th>
              <th className='px-3 py-3'>Peserta</th>
              <th className='px-3 py-3'>Kegiatan</th>
              <th className='px-3 py-3 text-center'>Aksi</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className='px-3 py-8 text-center text-sm text-muted-foreground'
                >
                  Belum ada jadwal pemesanan ruang yang sesuai.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className='transition-colors hover:bg-muted/40'
                >
                  <td className='whitespace-nowrap px-3 py-3.5 align-top'>
                    <div className='font-medium text-foreground'>
                      {formatTanggalPendek(item.tanggal)}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {item.jamMulai}–{item.jamSelesai}
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-3 py-3.5 align-top font-medium text-foreground'>
                    {item.namaRuang}
                  </td>
                  <td className='px-3 py-3.5 align-top text-foreground'>
                    {item.namaPeminjam}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3.5 align-top text-foreground'>
                    {item.jumlahPeserta}
                  </td>
                  <td className='max-w-72 px-3 py-3.5 align-top text-foreground'>
                    {item.kegiatan}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3.5 text-center align-top'>
                    <div className='inline-flex items-center gap-1'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='size-7 cursor-pointer'
                        title='Detail Pemesanan'
                        onClick={() => onDetail(item)}
                      >
                        <Eye className='size-3.5' />
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='size-7 cursor-pointer text-amber-600 hover:text-amber-700'
                        title='Edit Pemesanan'
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className='size-3.5' />
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='size-7 cursor-pointer text-destructive hover:text-destructive'
                        title='Batalkan / Hapus'
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className='size-3.5' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
        <span>
          Menampilkan {startItem}–{endItem} dari {totalItems}
        </span>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 px-2.5 text-xs'
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Sebelumnya
          </Button>
          <span>
            Halaman {safePage} dari {totalPages}
          </span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 px-2.5 text-xs'
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
