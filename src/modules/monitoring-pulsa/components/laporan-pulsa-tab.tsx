'use client'

import {
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import type {
  MonitoringPulsaSummary,
  PulsaAlokasiDetail,
  PulsaKegiatanItem,
  PulsaPetugasRow,
  StatusPersetujuanPulsa,
} from '../types'
import { formatRupiah } from '../utils/format'

interface LaporanPulsaTabProps {
  periodeLabel: string
  summary: MonitoringPulsaSummary
  kegiatanList: PulsaKegiatanItem[]
  petugasRows: PulsaPetugasRow[]
  canManage: boolean
  canApprove: boolean
  updatingAlokasiId: string | null
  onEditKegiatan: (kegiatan: PulsaKegiatanItem) => void
  onDeleteKegiatan: (kegiatan: PulsaKegiatanItem) => void
  onBulkApproveKegiatan: (
    kegiatanId: string,
    status: StatusPersetujuanPulsa,
  ) => void
  onVerifyAlokasi: (
    alokasi: PulsaAlokasiDetail,
    status: StatusPersetujuanPulsa,
  ) => void
}

export function LaporanPulsaTab({
  periodeLabel,
  summary,
  kegiatanList,
  petugasRows,
  canManage,
  canApprove,
  updatingAlokasiId,
  onEditKegiatan,
  onDeleteKegiatan,
  onBulkApproveKegiatan,
  onVerifyAlokasi,
}: LaporanPulsaTabProps) {
  return (
    <div className='space-y-5'>
      {/* 4 Kartu Statistik Ringkasan */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border bg-card p-5 shadow-sm'>
          <p className='text-xs font-medium text-muted-foreground'>
            Total Petugas
          </p>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {summary.totalPetugas}
          </p>
          <p className='mt-1 text-[11px] text-muted-foreground'>
            Organik: {summary.totalOrganik} | Mitra: {summary.totalMitra}
          </p>
        </div>

        <div className='rounded-xl border bg-card p-5 shadow-sm'>
          <p className='text-xs font-medium text-muted-foreground'>
            Total Kegiatan
          </p>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {summary.totalKegiatan}
          </p>
          <p className='mt-1 text-[11px] text-muted-foreground'>
            Periode {periodeLabel}
          </p>
        </div>

        <div className='rounded-xl border bg-card p-5 shadow-sm'>
          <p className='text-xs font-medium text-muted-foreground'>
            Total Nominal Ajuan
          </p>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {formatRupiah(summary.totalNominalAjuan)}
          </p>
          <p className='mt-1 text-[11px] text-muted-foreground'>
            {summary.totalAlokasi} alokasi petugas
          </p>
        </div>

        <div className='rounded-xl border bg-card p-5 shadow-sm'>
          <p className='text-xs font-medium text-muted-foreground'>
            Total Disetujui PPK
          </p>
          <p className='mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
            {formatRupiah(summary.totalDisetujuiPpk)}
          </p>
          <p className='mt-1 text-[11px] text-muted-foreground'>
            {summary.totalDisetujuiOrg} dari {summary.totalAlokasi} disetujui
          </p>
        </div>
      </div>

      {/* Section 1: Breakdown per Kegiatan */}
      <div className='space-y-4 rounded-xl border bg-card p-5 shadow-sm'>
        <h3 className='text-sm font-semibold text-foreground'>
          Breakdown per Kegiatan — {periodeLabel}
        </h3>

        <div className='overflow-x-auto rounded-lg border'>
          <table className='w-full border-collapse text-xs'>
            <thead>
              <tr className='border-b bg-muted/60 text-foreground'>
                <th className='px-3 py-2.5 text-left font-semibold'>
                  Kegiatan
                </th>
                <th className='px-3 py-2.5 text-right font-semibold'>
                  Jml Petugas
                </th>
                <th className='px-3 py-2.5 text-right font-semibold'>
                  Disetujui (org)
                </th>
                <th className='px-3 py-2.5 text-right font-semibold'>
                  Total Ajuan
                </th>
                <th className='px-3 py-2.5 text-right font-semibold'>
                  Total Disetujui
                </th>
                {(canManage || canApprove) && (
                  <th className='px-3 py-2.5 text-center font-semibold'>
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className='divide-y'>
              {kegiatanList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-3 py-8 text-center text-muted-foreground'
                  >
                    Belum ada kegiatan pulsa pada periode {periodeLabel}.
                  </td>
                </tr>
              ) : (
                kegiatanList.map((keg) => (
                  <tr key={keg.id} className='hover:bg-muted/40'>
                    <td className='px-3 py-2.5 font-medium text-foreground'>
                      {keg.namaKegiatan}
                    </td>
                    <td className='px-3 py-2.5 text-right'>
                      {keg.jumlahPetugas}
                    </td>
                    <td className='px-3 py-2.5 text-right'>
                      {keg.jumlahDisetujui}
                    </td>
                    <td className='px-3 py-2.5 text-right'>
                      {formatRupiah(keg.totalAjuan)}
                    </td>
                    <td className='px-3 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400'>
                      {formatRupiah(keg.totalDisetujui)}
                    </td>
                    {(canManage || canApprove) && (
                      <td className='px-3 py-2.5 text-center'>
                        <div className='inline-flex items-center justify-center gap-1'>
                          {canApprove && (
                            <button
                              type='button'
                              onClick={() =>
                                onBulkApproveKegiatan(keg.id, 'DISETUJUI')
                              }
                              title='Setujui semua petugas di kegiatan ini'
                              className='cursor-pointer rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                            >
                              <CheckCheck className='size-3.5' />
                            </button>
                          )}
                          {canManage && (
                            <>
                              <button
                                type='button'
                                onClick={() => onEditKegiatan(keg)}
                                title='Edit kegiatan & petugas'
                                className='cursor-pointer rounded p-1 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50'
                              >
                                <Pencil className='size-3.5' />
                              </button>
                              <button
                                type='button'
                                onClick={() => onDeleteKegiatan(keg)}
                                title='Hapus kegiatan'
                                className='cursor-pointer rounded p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                              >
                                <Trash2 className='size-3.5' />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {kegiatanList.length > 0 && (
              <tfoot>
                <tr className='border-t bg-muted/60 font-semibold text-foreground'>
                  <td className='px-3 py-2.5'>JUMLAH</td>
                  <td className='px-3 py-2.5 text-right'>
                    {summary.totalAlokasi}
                  </td>
                  <td className='px-3 py-2.5 text-right'>
                    {summary.totalDisetujuiOrg}
                  </td>
                  <td className='px-3 py-2.5 text-right'>
                    {formatRupiah(summary.totalNominalAjuan)}
                  </td>
                  <td className='px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400'>
                    {formatRupiah(summary.totalDisetujuiPpk)}
                  </td>
                  {(canManage || canApprove) && <td />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Terbilang Total Disetujui */}
        <div className='rounded-lg border border-sky-200 bg-sky-50/70 px-4 py-3 text-xs dark:border-sky-900/60 dark:bg-sky-950/30'>
          <p className='text-muted-foreground'>Terbilang Total Disetujui:</p>
          <p className='mt-0.5 text-sm font-semibold text-sky-800 dark:text-sky-300'>
            {summary.terbilangDisetujui}
          </p>
        </div>
      </div>

      {/* Section 2: Daftar Petugas & Verifikasi PPK */}
      <div className='space-y-4 rounded-xl border bg-card p-5 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h3 className='text-sm font-semibold text-foreground'>
            Daftar Petugas — {periodeLabel}
          </h3>
          {canApprove && (
            <span className='text-[11px] text-muted-foreground'>
              Klik tombol ✓ (Setujui) atau ✕ (Tolak) per kegiatan untuk verifikasi PPK
            </span>
          )}
        </div>

        <div className='overflow-x-auto rounded-lg border'>
          <table className='w-full border-collapse text-xs'>
            <thead>
              <tr className='border-b bg-muted/60 text-foreground'>
                <th className='w-12 px-3 py-2.5 text-center font-semibold'>No</th>
                <th className='min-w-[180px] px-3 py-2.5 text-left font-semibold'>
                  Nama
                </th>
                <th className='w-24 px-3 py-2.5 text-center font-semibold'>
                  Tipe
                </th>
                <th className='min-w-[280px] px-3 py-2.5 text-left font-semibold'>
                  Kegiatan
                </th>
                <th className='min-w-[110px] px-3 py-2.5 text-right font-semibold'>
                  Total Ajuan
                </th>
                <th className='min-w-[110px] px-3 py-2.5 text-right font-semibold'>
                  Total Disetujui
                </th>
                <th className='min-w-[110px] px-3 py-2.5 text-center font-semibold'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {petugasRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-3 py-8 text-center text-muted-foreground'
                  >
                    Belum ada daftar petugas pada periode {periodeLabel}.
                  </td>
                </tr>
              ) : (
                petugasRows.map((row, idx) => (
                  <tr key={row.key} className='hover:bg-muted/40'>
                    <td className='px-3 py-2.5 text-center text-muted-foreground'>
                      {idx + 1}
                    </td>
                    <td className='px-3 py-2.5 font-medium text-foreground'>
                      {row.nama}
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
                    <td className='px-3 py-2.5'>
                      <div className='space-y-1'>
                        {row.daftarAlokasi.map((alo) => (
                          <div
                            key={alo.id}
                            className='flex items-center gap-1.5 text-[11px]'
                          >
                            {alo.status === 'DISETUJUI' && (
                              <CheckCircle2 className='size-3.5 shrink-0 text-emerald-600' />
                            )}
                            {alo.status === 'DITOLAK' && (
                              <XCircle className='size-3.5 shrink-0 text-rose-600' />
                            )}
                            {alo.status === 'DIAJUKAN' && (
                              <Clock className='size-3.5 shrink-0 text-amber-500' />
                            )}
                            <span className='text-foreground'>
                              {alo.namaKegiatan} —{' '}
                              <strong>{formatRupiah(alo.nominal)}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className='px-3 py-2.5 text-right font-semibold'>
                      {formatRupiah(row.totalAjuan)}
                    </td>
                    <td className='px-3 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400'>
                      {formatRupiah(row.totalDisetujui)}
                    </td>
                    <td className='px-3 py-2.5'>
                      <div className='flex flex-col items-center gap-1'>
                        {row.daftarAlokasi.map((alo) => {
                          const busy = updatingAlokasiId === alo.id
                          return (
                            <div
                              key={alo.id}
                              className='inline-flex items-center gap-1'
                            >
                              {canApprove ? (
                                <>
                                  <button
                                    type='button'
                                    disabled={busy}
                                    onClick={() =>
                                      onVerifyAlokasi(
                                        alo,
                                        alo.status === 'DISETUJUI'
                                          ? 'DIAJUKAN'
                                          : 'DISETUJUI',
                                      )
                                    }
                                    title={`Setujui: ${alo.namaKegiatan}`}
                                    className={`inline-flex size-5 cursor-pointer items-center justify-center rounded-full border transition ${
                                      alo.status === 'DISETUJUI'
                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                        : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  >
                                    <Check className='size-3' />
                                  </button>
                                  <button
                                    type='button'
                                    disabled={busy}
                                    onClick={() =>
                                      onVerifyAlokasi(
                                        alo,
                                        alo.status === 'DITOLAK'
                                          ? 'DIAJUKAN'
                                          : 'DITOLAK',
                                      )
                                    }
                                    title={`Tolak: ${alo.namaKegiatan}`}
                                    className={`inline-flex size-5 cursor-pointer items-center justify-center rounded-full border transition ${
                                      alo.status === 'DITOLAK'
                                        ? 'border-rose-600 bg-rose-600 text-white'
                                        : 'border-rose-300 text-rose-600 hover:bg-rose-50'
                                    }`}
                                  >
                                    <X className='size-3' />
                                  </button>
                                </>
                              ) : (
                                <span className='text-[11px] font-medium text-muted-foreground'>
                                  {alo.status}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
