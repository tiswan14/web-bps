'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchSuratList } from '../services/surat-api.service'
import { fetchPegawaiAktifOptions } from '@/modules/disposisi/services/disposisi-api.service'
import type {
  CreateDisposisiInput,
  DisposisiItem,
  PegawaiOption,
  SuratItem,
} from '../types'

interface FormDisposisiModalProps {
  open: boolean
  initialData?: DisposisiItem | null
  onClose: () => void
  onSubmit: (data: CreateDisposisiInput, editId?: string) => Promise<void>
}

export function FormDisposisiModal({
  open,
  initialData = null,
  onClose,
  onSubmit,
}: FormDisposisiModalProps) {
  const isEdit = Boolean(initialData)

  const [suratId, setSuratId] = useState('')
  const [kepadaPegawaiId, setKepadaPegawaiId] = useState('')
  const [tanggal, setTanggal] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [instruksi, setInstruksi] = useState('')

  const [suratOptions, setSuratOptions] = useState<SuratItem[]>([])
  const [pegawaiOptions, setPegawaiOptions] = useState<PegawaiOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setErrorMsg(null)
    if (initialData) {
      setSuratId(initialData.suratId)
      setKepadaPegawaiId(initialData.kepadaPegawaiId)
      setTanggal(initialData.tanggal.slice(0, 10))
      setInstruksi(initialData.instruksi)
    } else {
      setSuratId('')
      setKepadaPegawaiId('')
      setTanggal(new Date().toISOString().slice(0, 10))
      setInstruksi('')
    }

    let cancelled = false
    async function loadOptions() {
      try {
        setLoadingOptions(true)
        const [suratRes, pegawaiRes] = await Promise.all([
          fetchSuratList({ page: 1, limit: 50 }),
          fetchPegawaiAktifOptions(),
        ])
        if (!cancelled) {
          setSuratOptions(suratRes.items)
          setPegawaiOptions(pegawaiRes)
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(
            err instanceof Error
              ? err.message
              : 'Gagal memuat daftar surat atau pegawai',
          )
        }
      } finally {
        if (!cancelled) setLoadingOptions(false)
      }
    }

    void loadOptions()
    return () => {
      cancelled = true
    }
  }, [open, initialData])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!suratId || !kepadaPegawaiId || !instruksi.trim()) return

    try {
      setSubmitting(true)
      setErrorMsg(null)

      await onSubmit(
        {
          suratId,
          kepadaPegawaiId,
          tanggal,
          instruksi: instruksi.trim(),
        },
        initialData?.id,
      )

      onClose()
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Gagal menyimpan disposisi',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between border-b pb-3'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>
              {isEdit ? 'Edit Disposisi' : 'Buat Disposisi Baru'}
            </h2>
            <p className='text-xs text-muted-foreground'>
              Pilih surat dan pegawai penerima untuk meneruskan disposisi.
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7'
            disabled={submitting}
            onClick={onClose}
          >
            <X className='size-4' />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-3.5 text-sm'>
          {errorMsg && (
            <div className='rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive'>
              {errorMsg}
            </div>
          )}

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Pilih Surat
            </label>
            <select
              required
              disabled={loadingOptions}
              value={suratId}
              onChange={(e) => setSuratId(e.target.value)}
              className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
            >
              <option value=''>
                {loadingOptions ? 'Memuat daftar surat...' : '-- Pilih Surat --'}
              </option>
              {suratOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.jenis}] {s.nomor} — {s.perihal}
                </option>
              ))}
            </select>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Kepada Pegawai
              </label>
              <select
                required
                disabled={loadingOptions}
                value={kepadaPegawaiId}
                onChange={(e) => setKepadaPegawaiId(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
              >
                <option value=''>
                  {loadingOptions
                    ? 'Memuat pegawai...'
                    : '-- Pilih Pegawai --'}
                </option>
                {pegawaiOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} {p.jabatan ? `(${p.jabatan})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Tanggal Disposisi
              </label>
              <Input
                type='date'
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Instruksi Disposisi
            </label>
            <textarea
              required
              rows={3}
              placeholder='Contoh: Untuk ditindaklanjuti dan koordinasikan dengan tim terkait.'
              value={instruksi}
              onChange={(e) => setInstruksi(e.target.value)}
              className='w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
            />
          </div>

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button
              type='button'
              variant='outline'
              disabled={submitting}
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type='submit'
              disabled={submitting || loadingOptions}
              className='bg-emerald-600 text-white hover:bg-emerald-700'
            >
              {submitting
                ? 'Menyimpan...'
                : isEdit
                  ? 'Simpan Perubahan'
                  : 'Simpan Disposisi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface DetailDisposisiModalProps {
  disposisi: DisposisiItem | null
  onClose: () => void
  onEdit: (item: DisposisiItem) => void
}

export function DetailDisposisiModal({
  disposisi,
  onClose,
  onEdit,
}: DetailDisposisiModalProps) {
  if (!disposisi) return null

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(disposisi.tanggal))

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between border-b pb-3'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>
              Detail Disposisi
            </h2>
            <p className='text-xs text-muted-foreground'>
              {disposisi.nomorSurat}
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7'
            onClick={onClose}
          >
            <X className='size-4' />
          </Button>
        </div>

        <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
          <div>
            <dt className='text-xs text-muted-foreground'>Nomor Surat</dt>
            <dd className='font-medium text-foreground'>
              {disposisi.nomorSurat} ({disposisi.jenisSurat})
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Tanggal Disposisi</dt>
            <dd className='font-medium text-foreground'>{formattedDate}</dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>
              Asal / Tujuan Surat
            </dt>
            <dd className='font-medium text-foreground'>{disposisi.dari}</dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>Perihal Surat</dt>
            <dd className='font-medium text-foreground'>
              {disposisi.perihalSurat}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Diteruskan Kepada</dt>
            <dd className='font-medium text-foreground'>{disposisi.kepada}</dd>
            {disposisi.jabatanKepada && (
              <dd className='text-xs text-muted-foreground'>
                {disposisi.jabatanKepada}
              </dd>
            )}
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Dicatat Oleh</dt>
            <dd className='font-medium text-foreground'>
              {disposisi.dicatatOleh}
            </dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>Instruksi</dt>
            <dd className='rounded-md bg-muted/50 p-2.5 font-medium text-foreground'>
              {disposisi.instruksi}
            </dd>
          </div>
        </dl>

        <div className='mt-6 flex justify-end gap-2 border-t pt-4'>
          <Button type='button' variant='outline' onClick={onClose}>
            Tutup
          </Button>
          <Button
            type='button'
            className='bg-emerald-600 text-white hover:bg-emerald-700'
            onClick={() => {
              onClose()
              onEdit(disposisi)
            }}
          >
            Edit Disposisi
          </Button>
        </div>
      </div>
    </div>
  )
}

interface HapusDisposisiModalProps {
  disposisi: DisposisiItem | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function HapusDisposisiModal({
  disposisi,
  onClose,
  onConfirm,
}: HapusDisposisiModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!disposisi) return null

  async function handleDelete() {
    if (!disposisi) return
    try {
      setDeleting(true)
      setErrorMsg(null)
      await onConfirm(disposisi.id)
      onClose()
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Gagal menghapus disposisi',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-xl border bg-background p-6 shadow-lg'>
        <div className='flex items-start gap-3'>
          <div className='rounded-full bg-destructive/10 p-2 text-destructive'>
            <AlertTriangle className='size-5' />
          </div>
          <div className='space-y-1'>
            <h2 className='text-base font-semibold text-foreground'>
              Hapus Data Disposisi?
            </h2>
            <p className='text-xs text-muted-foreground'>
              Disposisi untuk surat{' '}
              <span className='font-semibold text-foreground'>
                {disposisi.nomorSurat}
              </span>{' '}
              kepada{' '}
              <span className='font-semibold text-foreground'>
                {disposisi.kepada}
              </span>{' '}
              akan dihapus permanen.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className='mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive'>
            {errorMsg}
          </div>
        )}

        <div className='mt-5 flex justify-end gap-2 border-t pt-4'>
          <Button
            type='button'
            variant='outline'
            disabled={deleting}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type='button'
            variant='destructive'
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </div>
      </div>
    </div>
  )
}
