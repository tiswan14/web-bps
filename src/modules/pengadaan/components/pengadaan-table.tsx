'use client'

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  formatRupiah,
  formatTanggalLengkap,
  STATUS_PENGADAAN_CONFIG,
} from '../data/mock-pengadaan'
import type { PengadaanItem } from '../types'

interface PengadaanTableProps {
  data: PengadaanItem[]
  periodeLabel: string
  summary: {
    totalRencana: number
    totalRealisasi: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onDetail: (item: PengadaanItem) => void
  onEdit: (item: PengadaanItem) => void
  onDelete: (item: PengadaanItem) => void
}

export function PengadaanTable({
  data,
  periodeLabel,
  summary,
  pagination,
  onPageChange,
  onDetail,
  onEdit,
  onDelete,
}: PengadaanTableProps) {
  const startRow =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const endRow = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  )

  return (
    <div className='rounded-xl border bg-card shadow-sm'>
      {/* Header Tabel */}
      <div className='border-b px-5 py-4'>
        <h2 className='text-base font-semibold text-foreground'>
          Data Pengadaan -{' '}
          <span className='text-emerald-700 dark:text-emerald-400'>
            {periodeLabel}
          </span>
        </h2>
        <p className='text-xs text-muted-foreground'>
          Menampilkan {data.length} dari {pagination.total} data pengadaan
        </p>
      </div>

      {/* Isi Tabel / Empty State */}
      {data.length === 0 ? (
        <div className='flex flex-col items-center justify-center px-4 py-14 text-center'>
          <div className='mb-3 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground'>
            <FileText className='size-6' />
          </div>
          <p className='text-sm font-medium text-foreground'>
            Tidak ada data pengadaan ditemukan
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Spreadsheet kosong. Gunakan tombol &quot;Tambah Pengadaan&quot;
            untuk menambah data.
          </p>
        </div>
      ) : (
        <>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-left text-sm'>
              <thead>
                <tr className='border-b bg-muted/40 text-xs font-semibold text-muted-foreground'>
                  <th className='w-12 px-4 py-3 text-center'>No</th>
                  <th className='whitespace-nowrap px-4 py-3'>
                    Tanggal Usulan
                  </th>
                  <th className='min-w-[180px] px-4 py-3'>Nama Produk</th>
                  <th className='min-w-[200px] px-4 py-3'>Detil POK</th>
                  <th className='whitespace-nowrap px-4 py-3'>Kode POK</th>
                  <th className='whitespace-nowrap px-4 py-3 text-right'>
                    Rencana
                  </th>
                  <th className='whitespace-nowrap px-4 py-3 text-right'>
                    Realisasi
                  </th>
                  <th className='whitespace-nowrap px-4 py-3 text-center'>
                    Status
                  </th>
                  <th className='whitespace-nowrap px-4 py-3 text-center'>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {data.map((item, idx) => {
                  const statusCfg = STATUS_PENGADAAN_CONFIG[item.status]
                  return (
                    <tr
                      key={item.id}
                      className='transition-colors hover:bg-muted/30'
                    >
                      <td className='px-4 py-3.5 text-center text-xs text-muted-foreground'>
                        {startRow + idx}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3.5 text-xs text-foreground'>
                        {formatTanggalLengkap(item.tanggalUsulan)}
                      </td>
                      <td className='px-4 py-3.5 text-xs font-medium text-foreground'>
                        {item.namaProduk}
                      </td>
                      <td className='px-4 py-3.5 text-xs text-muted-foreground'>
                        {item.detilPok}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground'>
                        {item.kodePok}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold text-foreground'>
                        {formatRupiah(item.rencana)}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold text-foreground'>
                        {formatRupiah(item.realisasi)}
                      </td>
                      <td className='whitespace-nowrap px-4 py-3.5 text-center'>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusCfg.badgeClass}`}
                        >
                          {statusCfg.badgeLabel}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-4 py-3.5 text-center'>
                        <div className='inline-flex items-center gap-1'>
                          <button
                            type='button'
                            title='Detail Data Pengadaan'
                            onClick={() => onDetail(item)}
                            className='cursor-pointer rounded-md p-1.5 text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/50'
                          >
                            <Eye className='size-4' />
                          </button>
                          <button
                            type='button'
                            title='Edit Pengadaan'
                            onClick={() => onEdit(item)}
                            className='cursor-pointer rounded-md p-1.5 text-amber-600 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50'
                          >
                            <Pencil className='size-4' />
                          </button>
                          <button
                            type='button'
                            title='Hapus Pengadaan'
                            onClick={() => onDelete(item)}
                            className='cursor-pointer rounded-md p-1.5 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50'
                          >
                            <Trash2 className='size-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className='border-t-2 bg-muted/30 font-semibold text-foreground'>
                  <td
                    colSpan={5}
                    className='px-4 py-3 text-right text-xs text-muted-foreground'
                  >
                    Total Anggaran
                  </td>
                  <td className='whitespace-nowrap px-4 py-3 text-right text-xs font-bold text-foreground'>
                    {formatRupiah(summary.totalRencana)}
                  </td>
                  <td className='whitespace-nowrap px-4 py-3 text-right text-xs font-bold text-foreground'>
                    {formatRupiah(summary.totalRealisasi)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Paginasi sesuai KECAP MAJA */}
          <div className='flex flex-col gap-2 border-t px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
            <span>
              Menampilkan {startRow} sampai {endRow} dari {pagination.total}{' '}
              data
            </span>

            <div className='inline-flex items-center gap-2'>
              <button
                type='button'
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
                className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md border bg-background text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40'
              >
                <ChevronLeft className='size-3.5' />
              </button>
              <span className='font-medium text-foreground'>
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <button
                type='button'
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
                className='inline-flex size-7 cursor-pointer items-center justify-center rounded-md border bg-background text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40'
              >
                <ChevronRight className='size-3.5' />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
