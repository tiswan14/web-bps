'use client'

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  Pencil,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DAFTAR_JENIS_DOKUMEN,
  formatRupiah,
  formatTanggalLengkap,
  JENIS_PENGADAAN_LABEL,
  STATUS_PENGADAAN_CONFIG,
} from '../data/mock-pengadaan'
import type {
  CreatePengadaanInput,
  JenisPengadaan,
  PengadaanItem,
  StatusPengadaan,
} from '../types'

interface FormPengadaanModalProps {
  open: boolean
  initialData: PengadaanItem | null
  onClose: () => void
  onSubmit: (
    input: CreatePengadaanInput,
    editId?: string,
  ) => Promise<void> | void
}

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function FormPengadaanModal({
  open,
  initialData,
  onClose,
  onSubmit,
}: FormPengadaanModalProps) {
  const [tanggalUsulan, setTanggalUsulan] = useState(getTodayIso())
  const [jenisPengadaan, setJenisPengadaan] =
    useState<JenisPengadaan>('BARANG')
  const [namaProduk, setNamaProduk] = useState('')
  const [detilPok, setDetilPok] = useState('')
  const [kodePok, setKodePok] = useState('')
  const [status, setStatus] = useState<StatusPengadaan>('USULAN')

  // Informasi Keuangan
  const [rencana, setRencana] = useState('')
  const [realisasi, setRealisasi] = useState('0')

  // Dokumen & Realisasi
  const [formPermintaan, setFormPermintaan] = useState('')
  const [linkKak, setLinkKak] = useState('')
  const [jenisDokumen, setJenisDokumen] = useState('')
  const [nomorDokumen, setNomorDokumen] = useState('')
  const [tanggalDokumen, setTanggalDokumen] = useState('')
  const [namaPenyedia, setNamaPenyedia] = useState('')
  const [tanggalPembayaran, setTanggalPembayaran] = useState('')
  const [nomorBuktiPembayaran, setNomorBuktiPembayaran] = useState('')
  const [linkEpurchasing, setLinkEpurchasing] = useState('')
  const [keterangan, setKeterangan] = useState('')

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    if (initialData) {
      setTanggalUsulan(initialData.tanggalUsulan)
      setJenisPengadaan(initialData.jenisPengadaan)
      setNamaProduk(initialData.namaProduk)
      setDetilPok(initialData.detilPok)
      setKodePok(initialData.kodePok)
      setStatus(initialData.status)
      setRencana(String(initialData.rencana))
      setRealisasi(String(initialData.realisasi))
      setFormPermintaan(initialData.formPermintaan ?? '')
      setLinkKak(initialData.linkKak ?? '')
      setJenisDokumen(initialData.jenisDokumen ?? '')
      setNomorDokumen(initialData.nomorDokumen ?? '')
      setTanggalDokumen(initialData.tanggalDokumen ?? '')
      setNamaPenyedia(initialData.namaPenyedia ?? '')
      setTanggalPembayaran(initialData.tanggalPembayaran ?? '')
      setNomorBuktiPembayaran(initialData.nomorBuktiPembayaran ?? '')
      setLinkEpurchasing(initialData.linkEpurchasing ?? '')
      setKeterangan(initialData.keterangan ?? '')
    } else {
      setTanggalUsulan(getTodayIso())
      setJenisPengadaan('BARANG')
      setNamaProduk('')
      setDetilPok('')
      setKodePok('')
      setStatus('USULAN')
      setRencana('')
      setRealisasi('0')
      setFormPermintaan('')
      setLinkKak('')
      setJenisDokumen('')
      setNomorDokumen('')
      setTanggalDokumen('')
      setNamaPenyedia('')
      setTanggalPembayaran('')
      setNomorBuktiPembayaran('')
      setLinkEpurchasing('')
      setKeterangan('')
    }
    setErrorMsg(null)
  }, [open, initialData])

  if (!open) return null

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const nominalRencana = Number(rencana)
    const nominalRealisasi = Number(realisasi || 0)

    if (!tanggalUsulan) {
      setErrorMsg('Tanggal usulan wajib diisi.')
      return
    }
    if (!namaProduk.trim()) {
      setErrorMsg('Nama produk barang/jasa wajib diisi.')
      return
    }
    if (!detilPok.trim()) {
      setErrorMsg('Nama kegiatan / detil POK wajib diisi.')
      return
    }
    if (!kodePok.trim()) {
      setErrorMsg('Kode POK wajib diisi.')
      return
    }
    if (Number.isNaN(nominalRencana) || nominalRencana <= 0) {
      setErrorMsg('Rencana pembelanjaan (RAB) harus lebih dari 0.')
      return
    }
    if (Number.isNaN(nominalRealisasi) || nominalRealisasi < 0) {
      setErrorMsg('Nilai realisasi tidak boleh negatif.')
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(
        {
          tanggalUsulan,
          jenisPengadaan,
          namaProduk: namaProduk.trim(),
          detilPok: detilPok.trim(),
          kodePok: kodePok.trim(),
          status,
          rencana: Math.round(nominalRencana),
          realisasi: Math.round(nominalRealisasi),
          formPermintaan: formPermintaan.trim() || null,
          linkKak: linkKak.trim() || null,
          jenisDokumen: jenisDokumen.trim() || null,
          nomorDokumen: nomorDokumen.trim() || null,
          tanggalDokumen: tanggalDokumen || null,
          namaPenyedia: namaPenyedia.trim() || null,
          tanggalPembayaran: tanggalPembayaran || null,
          nomorBuktiPembayaran: nomorBuktiPembayaran.trim() || null,
          linkEpurchasing: linkEpurchasing.trim() || null,
          keterangan: keterangan.trim() || null,
        },
        initialData?.id,
      )
      onClose()
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal menyimpan data pengadaan.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-background shadow-xl'>
        {/* Header Modal Biru sesuai KECAP MAJA */}
        <div className='sticky top-0 z-10 flex items-center justify-between bg-[#1d70b8] px-6 py-4 text-white'>
          <div>
            <h3 className='text-base font-semibold'>
              {initialData ? 'Edit Data Pengadaan' : 'Tambah Data Pengadaan'}
            </h3>
            <p className='text-xs text-sky-100'>
              Input rencana pembelanjaan (RAB), dokumen, dan realisasi
              pengadaan.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='cursor-pointer rounded-md bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25'
          >
            <X className='size-4' />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className='space-y-5 p-6'>
          {errorMsg && (
            <div className='rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive'>
              {errorMsg}
            </div>
          )}

          {/* Bagian 1: Informasi Umum */}
          <div className='space-y-3'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Tanggal Usulan <span className='text-destructive'>*</span>
                </label>
                <input
                  type='date'
                  value={tanggalUsulan}
                  onChange={(e) => setTanggalUsulan(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                  required
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Jenis Pengadaan <span className='text-destructive'>*</span>
                </label>
                <select
                  value={jenisPengadaan}
                  onChange={(e) =>
                    setJenisPengadaan(e.target.value as JenisPengadaan)
                  }
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                >
                  <option value='BARANG'>Barang</option>
                  <option value='JASA'>Jasa</option>
                </select>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Status <span className='text-destructive'>*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusPengadaan)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                >
                  {Object.entries(STATUS_PENGADAAN_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-foreground'>
                Nama Produk Barang/Jasa{' '}
                <span className='text-destructive'>*</span>
              </label>
              <input
                type='text'
                placeholder='Contoh: Pulsa 45K (4 nomor)'
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-foreground'>
                Nama Kegiatan/Detil POK{' '}
                <span className='text-destructive'>*</span>
              </label>
              <input
                type='text'
                placeholder='Contoh: biaya paket data pengumpulan data laporan bulanan'
                value={detilPok}
                onChange={(e) => setDetilPok(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-foreground'>
                Kode POK <span className='text-destructive'>*</span>
              </label>
              <input
                type='text'
                placeholder='Contoh: 2909.BMA.005 052 A 521211'
                value={kodePok}
                onChange={(e) => setKodePok(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 font-mono text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                required
              />
            </div>
          </div>

          {/* Bagian 2: Informasi Keuangan */}
          <div className='space-y-3 border-t pt-4'>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
              <DollarSign className='size-4 text-emerald-600' />
              <span>Informasi Keuangan</span>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Rencana Pembelanjaan / (RAB){' '}
                  <span className='text-destructive'>*</span>
                </label>
                <input
                  type='number'
                  min={1}
                  placeholder='0'
                  value={rencana}
                  onChange={(e) => setRencana(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-emerald-600/30'
                  required
                />
                {Number(rencana) > 0 && (
                  <p className='text-[11px] font-medium text-emerald-700 dark:text-emerald-400'>
                    {formatRupiah(Number(rencana))}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Nilai Realisasi
                </label>
                <input
                  type='number'
                  min={0}
                  placeholder='0'
                  value={realisasi}
                  onChange={(e) => setRealisasi(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-emerald-600/30'
                />
                {Number(realisasi) >= 0 && realisasi !== '' && (
                  <p className='text-[11px] font-medium text-emerald-700 dark:text-emerald-400'>
                    {formatRupiah(Number(realisasi))}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bagian 3: Dokumen & Realisasi */}
          <div className='space-y-3 border-t pt-4'>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
              <FileText className='size-4 text-sky-600' />
              <span>Dokumen &amp; Realisasi</span>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Form Permintaan (FP)
                </label>
                <input
                  type='text'
                  placeholder='Contoh: 001/PPK/LPTB/I/2026'
                  value={formPermintaan}
                  onChange={(e) => setFormPermintaan(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Link Kerangka Acuan Kerja (KAK)
                </label>
                <input
                  type='text'
                  placeholder='https://... atau -'
                  value={linkKak}
                  onChange={(e) => setLinkKak(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Jenis Dokumen Pengadaan
                </label>
                <select
                  value={jenisDokumen}
                  onChange={(e) => setJenisDokumen(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                >
                  <option value=''>-- Pilih Jenis Dokumen --</option>
                  {DAFTAR_JENIS_DOKUMEN.map((dok) => (
                    <option key={dok} value={dok}>
                      {dok}
                    </option>
                  ))}
                </select>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Nomor Dokumen Pengadaan
                </label>
                <input
                  type='text'
                  placeholder='Contoh: 001/PPK/LPTB/I/2026'
                  value={nomorDokumen}
                  onChange={(e) => setNomorDokumen(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Tanggal Dokumen Pengadaan
                </label>
                <input
                  type='date'
                  value={tanggalDokumen}
                  onChange={(e) => setTanggalDokumen(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Nama Penyedia / Mitra
                </label>
                <input
                  type='text'
                  placeholder='Contoh: Adreena Store'
                  value={namaPenyedia}
                  onChange={(e) => setNamaPenyedia(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Tanggal Pembayaran
                </label>
                <input
                  type='date'
                  value={tanggalPembayaran}
                  onChange={(e) => setTanggalPembayaran(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-foreground'>
                  Nomor Bukti Pembayaran
                </label>
                <input
                  type='text'
                  placeholder='Nomor SP2D / Kuitansi / Bukti Bayar'
                  value={nomorBuktiPembayaran}
                  onChange={(e) => setNomorBuktiPembayaran(e.target.value)}
                  className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-foreground'>
                Link E-Purchasing / E-Katalog
              </label>
              <input
                type='text'
                placeholder='https://digipaysatu.kemenkeu.go.id/...'
                value={linkEpurchasing}
                onChange={(e) => setLinkEpurchasing(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-foreground'>
                Keterangan / Catatan
              </label>
              <textarea
                rows={2}
                placeholder='Catatan proses pengadaan...'
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className='w-full rounded-md border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-600/30'
              />
            </div>
          </div>

          <div className='flex items-center justify-end gap-2 border-t pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type='submit'
              disabled={submitting}
              className='cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
            >
              {submitting
                ? 'Menyimpan...'
                : initialData
                  ? 'Simpan Perubahan'
                  : 'Simpan Pengadaan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReadonlyField({
  label,
  value,
  mono = false,
}: {
  label: string
  value?: string | null
  mono?: boolean
}) {
  return (
    <div className='space-y-1'>
      <p className='text-[11px] font-medium text-muted-foreground'>{label}</p>
      <div
        className={`min-h-[34px] rounded-md border bg-muted/30 px-3 py-1.5 text-xs text-foreground ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value && value.trim() ? value : '-'}
      </div>
    </div>
  )
}

function LinkField({
  label,
  url,
}: {
  label: string
  url?: string | null
}) {
  const isHttp = url && /^https?:\/\//i.test(url.trim())
  return (
    <div className='space-y-1'>
      <p className='text-[11px] font-medium text-muted-foreground'>{label}</p>
      <div className='min-h-[34px] rounded-md border bg-muted/30 px-3 py-1.5 text-xs'>
        {isHttp ? (
          <a
            href={url.trim()}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 break-all text-sky-600 hover:underline dark:text-sky-400'
          >
            <span>{url.trim()}</span>
            <ExternalLink className='size-3 shrink-0' />
          </a>
        ) : (
          <span className='text-foreground'>{url && url.trim() ? url : '-'}</span>
        )}
      </div>
    </div>
  )
}

interface DetailPengadaanModalProps {
  item: PengadaanItem | null
  onClose: () => void
  onEdit: (item: PengadaanItem) => void
}

export function DetailPengadaanModal({
  item,
  onClose,
  onEdit,
}: DetailPengadaanModalProps) {
  if (!item) return null

  const statusCfg = STATUS_PENGADAAN_CONFIG[item.status]

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-background shadow-xl'>
        {/* Header Biru Detail Data Pengadaan sesuai KECAP MAJA */}
        <div className='sticky top-0 z-10 flex items-start justify-between bg-[#1d70b8] px-6 py-4 text-white'>
          <div className='space-y-0.5'>
            <div className='flex items-center gap-2'>
              <Eye className='size-4' />
              <h3 className='text-base font-semibold'>Detail Data Pengadaan</h3>
            </div>
            <p className='text-xs text-sky-100'>{item.namaProduk}</p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='cursor-pointer rounded-md bg-white/15 p-1 text-white transition-colors hover:bg-white/25'
          >
            <X className='size-4' />
          </button>
        </div>

        <div className='space-y-5 p-6'>
          {/* Box Ringkasan 3 Kolom: ID Pengadaan, Status, Tahun Anggaran */}
          <div className='grid grid-cols-1 gap-3 rounded-xl border bg-sky-50/40 p-4 text-center sm:grid-cols-3 dark:bg-sky-950/20'>
            <div>
              <p className='text-[11px] text-muted-foreground'>ID Pengadaan</p>
              <p className='mt-1 break-all font-mono text-xs font-bold text-[#1d70b8] dark:text-sky-400'>
                {item.kodePengadaan}
              </p>
            </div>
            <div>
              <p className='text-[11px] text-muted-foreground'>Status</p>
              <div className='mt-1'>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusCfg.badgeClass}`}
                >
                  {statusCfg.badgeLabel}
                </span>
              </div>
            </div>
            <div>
              <p className='text-[11px] text-muted-foreground'>
                Tahun Anggaran
              </p>
              <p className='mt-1 text-sm font-bold text-[#1d70b8] dark:text-sky-400'>
                {item.tahunAnggaran}
              </p>
            </div>
          </div>

          {/* Informasi Umum */}
          <div className='space-y-3'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <ReadonlyField
                label='Tanggal Usulan'
                value={formatTanggalLengkap(item.tanggalUsulan)}
              />
              <ReadonlyField
                label='Jenis Pengadaan'
                value={JENIS_PENGADAAN_LABEL[item.jenisPengadaan]}
              />
            </div>

            <ReadonlyField
              label='Nama Produk Barang/Jasa'
              value={item.namaProduk}
            />
            <ReadonlyField
              label='Nama Kegiatan/Detil POK'
              value={item.detilPok}
            />
            <ReadonlyField label='Kode POK' value={item.kodePok} mono />
          </div>

          {/* Informasi Keuangan */}
          <div className='space-y-2.5 border-t pt-4'>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
              <DollarSign className='size-4 text-emerald-600' />
              <span>Informasi Keuangan</span>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='space-y-1'>
                <p className='text-[11px] font-medium text-muted-foreground'>
                  Rencana Pembelanjaan / (RAB)
                </p>
                <div className='rounded-md border border-emerald-200/80 bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'>
                  {formatRupiah(item.rencana)}
                </div>
              </div>

              <div className='space-y-1'>
                <p className='text-[11px] font-medium text-muted-foreground'>
                  Nilai Realisasi
                </p>
                <div className='rounded-md border border-emerald-200/80 bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'>
                  {formatRupiah(item.realisasi)}
                </div>
              </div>
            </div>
          </div>

          {/* Dokumen & Realisasi */}
          <div className='space-y-3 border-t pt-4'>
            <div className='flex items-center gap-1.5 text-xs font-semibold text-foreground'>
              <FileText className='size-4 text-sky-600' />
              <span>Dokumen &amp; Realisasi</span>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <ReadonlyField
                label='Form Permintaan (FP)'
                value={item.formPermintaan}
              />
              <LinkField
                label='Link Kerangka Acuan Kerja (KAK)'
                url={item.linkKak}
              />
              <ReadonlyField
                label='Jenis Dokumen Pengadaan'
                value={item.jenisDokumen}
              />
              <ReadonlyField
                label='Nomor Dokumen Pengadaan'
                value={item.nomorDokumen}
              />
              <ReadonlyField
                label='Tanggal Dokumen Pengadaan'
                value={formatTanggalLengkap(item.tanggalDokumen)}
              />
              <ReadonlyField
                label='Nama Penyedia / Mitra'
                value={item.namaPenyedia}
              />
              <ReadonlyField
                label='Tanggal Pembayaran'
                value={formatTanggalLengkap(item.tanggalPembayaran)}
              />
              <ReadonlyField
                label='Nomor Bukti Pembayaran'
                value={item.nomorBuktiPembayaran}
              />
            </div>

            <LinkField
              label='Link E-Purchasing / E-Katalog'
              url={item.linkEpurchasing}
            />
            <ReadonlyField
              label='Keterangan / Catatan'
              value={item.keterangan}
            />
          </div>

          <div className='flex items-center justify-end gap-2 border-t pt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Tutup
            </Button>
            <Button
              type='button'
              onClick={() => {
                onClose()
                onEdit(item)
              }}
              className='cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
            >
              <Pencil className='size-3.5' />
              Edit Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface HapusPengadaanModalProps {
  item: PengadaanItem | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void> | void
}

export function HapusPengadaanModal({
  item,
  onClose,
  onConfirm,
}: HapusPengadaanModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!item) return null

  async function handleConfirmDelete() {
    if (!item) return
    try {
      setDeleting(true)
      setErrorMsg(null)
      await onConfirm(item.id)
      onClose()
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal menghapus data pengadaan.',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-xl border bg-background p-6 shadow-xl'>
        <div className='flex items-start gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'>
            <AlertTriangle className='size-5' />
          </div>
          <div className='w-full'>
            <h3 className='text-base font-semibold text-foreground'>
              Hapus Data Pengadaan?
            </h3>
            <p className='mt-1 text-xs text-muted-foreground'>
              Data usulan pengadaan berikut akan dihapus permanen dari database:
            </p>
            <div className='mt-2.5 rounded-lg border bg-muted/40 p-2.5 text-xs'>
              <p className='font-semibold text-foreground'>{item.namaProduk}</p>
              <p className='mt-0.5 font-mono text-[11px] text-muted-foreground'>
                {item.kodePengadaan} • {formatRupiah(item.rencana)}
              </p>
            </div>
            {errorMsg && (
              <p className='mt-2 text-xs text-destructive'>{errorMsg}</p>
            )}
          </div>
        </div>

        <div className='mt-5 flex items-center justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={deleting}
          >
            Batal
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirmDelete}
            disabled={deleting}
            className='cursor-pointer'
          >
            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>
      </div>
    </div>
  )
}
