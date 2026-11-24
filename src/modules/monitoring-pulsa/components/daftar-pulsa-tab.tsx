'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  XCircle,
} from 'lucide-react'
import type {
  PulsaAlokasiDetail,
  PulsaKegiatanItem,
  PulsaPetugasRow,
  StatusPersetujuanPulsa,
} from '../types'
import { formatRupiah } from '../utils/format'

interface DaftarPulsaTabProps {
  kegiatanList: PulsaKegiatanItem[]
  petugasRows: PulsaPetugasRow[]
  canApprove: boolean
  updatingAlokasiId: string | null
  onToggleStatusAlokasi: (
    alokasi: PulsaAlokasiDetail,
    nextStatus: StatusPersetujuanPulsa,
  ) => void
}

export function DaftarPulsaTab({
  kegiatanList,
  petugasRows,
  canApprove,
  updatingAlokasiId,
  onToggleStatusAlokasi,
}: DaftarPulsaTabProps) {
  const [search, setSearch] = useState('')
  const [filterTipe, setFilterTipe] = useState<'ALL' | 'ORGANIK' | 'MITRA' | 'DUPLIKASI'>('ALL')

  const filteredRows = useMemo(() => {
    return petugasRows.filter((row) => {
      if (filterTipe === 'ORGANIK' && row.tipe !== 'ORGANIK') return false
      if (filterTipe === 'MITRA' && row.tipe !== 'MITRA') return false
      if (filterTipe === 'DUPLIKASI' && !row.isDuplikasi) return false
      if (
        search.trim() &&
        !row.nama.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [petugasRows, filterTipe, search])

  function getNextStatus(current: StatusPersetujuanPulsa): StatusPersetujuanPulsa {
    if (current === 'DIAJUKAN') return 'DISETUJUI'
    if (current === 'DISETUJUI') return 'DITOLAK'
    return 'DIAJUKAN'
  }

  return (
    <div className='space-y-4 rounded-xl border bg-card p-5 shadow-sm'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-base font-semibold text-foreground'>
            Daftar Pulsa
          </h2>
          <p className='text-xs text-muted-foreground'>
            Matriks ajuan pulsa/paket data per petugas dan kegiatan pada periode aktif
            {canApprove && ' • Klik nominal sel kegiatan untuk mengubah persetujuan PPK'}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative'>
            <Search className='pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground' />
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Cari nama petugas...'
              className='h-8 rounded-md border bg-background pr-3 pl-8 text-xs outline-none focus:ring-2 focus:ring-emerald-600/30'
            />
          </div>

          <select
            value={filterTipe}
            onChange={(e) =>
              setFilterTipe(
                e.target.value as 'ALL' | 'ORGANIK' | 'MITRA' | 'DUPLIKASI',
              )
            }
            className='h-8 rounded-md border bg-background px-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-600/30'
          >
            <option value='ALL'>Semua Petugas ({petugasRows.length})</option>
            <option value='ORGANIK'>Organik</option>
            <option value='MITRA'>Mitra</option>
            <option value='DUPLIKASI'>Duplikasi Kegiatan</option>
          </select>
        </div>
      </div>

      {filteredRows.length === 0 ? (
        <div className='rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground'>
          Belum ada data ajuan pulsa pada periode ini. Tambahkan melalui tab{' '}
          <span className='font-medium text-foreground'>
            Tambah Ajuan Pulsa/Paket Data
          </span>
          .
        </div>
      ) : (
        <div className='overflow-x-auto rounded-lg border'>
          <table className='w-full border-collapse text-xs'>
            <thead>
              <tr className='border-b bg-muted/60 text-foreground'>
                <th className='w-12 px-3 py-3 text-center font-semibold'>No</th>
                <th className='min-w-[180px] px-3 py-3 text-left font-semibold'>
                  Nama
                </th>
                <th className='w-24 px-3 py-3 text-center font-semibold'>
                  Status
                </th>
                {kegiatanList.map((keg) => (
                  <th
                    key={keg.id}
                    className='min-w-[155px] px-3 py-3 text-right font-semibold leading-snug'
                  >
                    {keg.namaKegiatan}
                  </th>
                ))}
                <th className='min-w-[115px] px-3 py-3 text-right font-semibold'>
                  Total Ajuan
                </th>
                <th className='min-w-[115px] px-3 py-3 text-right font-semibold'>
                  Total Disetujui
                </th>
                <th className='w-12 px-3 py-3 text-center font-semibold'>✓</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {filteredRows.map((row, idx) => (
                <tr
                  key={row.key}
                  className={
                    row.isDuplikasi
                      ? 'bg-amber-50/40 hover:bg-amber-50/70 dark:bg-amber-950/15'
                      : 'hover:bg-muted/40'
                  }
                >
                  <td className='px-3 py-2.5 text-center text-muted-foreground'>
                    {idx + 1}
                  </td>
                  <td className='px-3 py-2.5'>
                    <div className='font-medium text-foreground'>{row.nama}</div>
                    {row.isDuplikasi && (
                      <div className='mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400'>
                        <AlertTriangle className='size-3 shrink-0' />
                        <span>Duplikasi kegiatan ({row.jumlahKegiatan})</span>
                      </div>
                    )}
                  </td>
                  <td className='px-3 py-2.5 text-center'>
                    {row.tipe === 'ORGANIK' ? (
                      <span className='inline-flex items-center rounded-full bg-orange-500 px-2.5 py-0.5 text-[11px] font-semibold text-white'>
                        Organik
                      </span>
                    ) : (
                      <span className='inline-flex items-center rounded-full bg-sky-600 px-2.5 py-0.5 text-[11px] font-semibold text-white'>
                        Mitra
                      </span>
                    )}
                  </td>

                  {kegiatanList.map((keg) => {
                    const alokasi = row.kegiatanMap[keg.id]
                    if (!alokasi) {
                      return (
                        <td
                          key={keg.id}
                          className='px-3 py-2.5 text-center text-muted-foreground'
                        >
                          -
                        </td>
                      )
                    }

                    const isUpdating = updatingAlokasiId === alokasi.id

                    return (
                      <td key={keg.id} className='px-3 py-2.5 text-right'>
                        <button
                          type='button'
                          disabled={!canApprove || isUpdating}
                          onClick={() =>
                            onToggleStatusAlokasi(
                              alokasi,
                              getNextStatus(alokasi.status),
                            )
                          }
                          title={
                            canApprove
                              ? `Status: ${alokasi.status} (Klik untuk ubah persetujuan)`
                              : `Status: ${alokasi.status}`
                          }
                          className={`inline-flex items-center justify-end gap-1.5 rounded px-1.5 py-0.5 font-medium transition ${
                            canApprove
                              ? 'cursor-pointer hover:bg-muted'
                              : 'cursor-default'
                          }`}
                        >
                          <span>{formatRupiah(alokasi.nominal)}</span>
                          {alokasi.status === 'DISETUJUI' && (
                            <CheckCircle2 className='size-3.5 text-emerald-600' />
                          )}
                          {alokasi.status === 'DIAJUKAN' && (
                            <Clock className='size-3.5 text-amber-500' />
                          )}
                          {alokasi.status === 'DITOLAK' && (
                            <XCircle className='size-3.5 text-rose-600' />
                          )}
                        </button>
                      </td>
                    )
                  })}

                  <td className='px-3 py-2.5 text-right font-semibold text-foreground'>
                    {formatRupiah(row.totalAjuan)}
                  </td>
                  <td className='px-3 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400'>
                    {formatRupiah(row.totalDisetujui)}
                  </td>
                  <td className='px-3 py-2.5 text-center'>
                    {row.statusKeseluruhan === 'SEMUA_DISETUJUI' && (
                      <CheckCircle2 className='mx-auto size-4 text-emerald-600' />
                    )}
                    {row.statusKeseluruhan === 'SEBAGIAN_DISETUJUI' && (
                      <Clock className='mx-auto size-4 text-amber-500' />
                    )}
                    {row.statusKeseluruhan === 'MENUNGGU' && (
                      <Clock className='mx-auto size-4 text-muted-foreground' />
                    )}
                    {row.statusKeseluruhan === 'DITOLAK' && (
                      <XCircle className='mx-auto size-4 text-rose-600' />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
