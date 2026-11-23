'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  CreateSuratInput,
  JenisSurat,
  SifatSurat,
  SuratItem,
} from '../types'

interface CatatSuratModalProps {
  open: boolean
  defaultJenis?: JenisSurat
  initialData?: SuratItem | null
  onClose: () => void
  onSubmit: (suratData: CreateSuratInput, editId?: string) => Promise<void>
}

export function CatatSuratModal({
  open,
  defaultJenis = 'MASUK',
  initialData = null,
  onClose,
  onSubmit,
}: CatatSuratModalProps) {
  const isEdit = Boolean(initialData)

  const [jenis, setJenis] = useState<JenisSurat>(defaultJenis)
  const [nomor, setNomor] = useState('')
  const [tanggal, setTanggal] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [asalTujuan, setAsalTujuan] = useState('')
  const [perihal, setPerihal] = useState('')
  const [sifat, setSifat] = useState<SifatSurat>('BIASA')
  const [pengantaran, setPengantaran] = useState('')
  const [status, setStatus] = useState('Diproses')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    setErrorMsg(null)
    if (initialData) {
      setJenis(initialData.jenis)
      setNomor(initialData.nomor)
      setTanggal(initialData.tanggal.slice(0, 10))
      setAsalTujuan(initialData.asalTujuan)
      setPerihal(initialData.perihal)
      setSifat(initialData.sifat)
      setPengantaran(initialData.pengantaran ?? '')
      setStatus(initialData.status ?? 'Diproses')
    } else {
      setJenis(defaultJenis)
      setNomor('')
      setTanggal(new Date().toISOString().slice(0, 10))
      setAsalTujuan('')
      setPerihal('')
      setSifat('BIASA')
      setPengantaran('')
      setStatus('Diproses')
    }
  }, [open, defaultJenis, initialData])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nomor.trim() || !asalTujuan.trim() || !perihal.trim()) return

    const periodeId = Number(tanggal.slice(0, 4)) || new Date().getFullYear()

    try {
      setSubmitting(true)
      setErrorMsg(null)

      await onSubmit(
        {
          jenis,
          nomor: nomor.trim(),
          tanggal,
          asalTujuan: asalTujuan.trim(),
          perihal: perihal.trim(),
          sifat,
          pengantaran: pengantaran.trim() || null,
          status: status.trim() || null,
          periodeId,
        },
        initialData?.id,
      )

      onClose()
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Gagal menyimpan data surat',
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
              {isEdit
                ? `Edit Surat ${jenis === 'MASUK' ? 'Masuk' : 'Keluar'}`
                : `Catat Surat ${jenis === 'MASUK' ? 'Masuk' : 'Keluar'}`}
            </h2>
            <p className='text-xs text-muted-foreground'>
              {isEdit
                ? 'Perbarui rincian data surat yang sudah tercatat.'
                : 'Isi detail surat masuk atau surat keluar fisik.'}
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

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Jenis Surat
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value as JenisSurat)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
              >
                <option value='MASUK'>Surat Masuk</option>
                <option value='KELUAR'>Surat Keluar</option>
              </select>
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Tanggal Surat
              </label>
              <Input
                type='date'
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Nomor Surat
              </label>
              <Input
                required
                placeholder='Contoh: 123/32180/HM.100/11/2026'
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Sifat Surat
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
              >
                <option value='BIASA'>Biasa</option>
                <option value='PENTING'>Penting</option>
              </select>
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              {jenis === 'MASUK' ? 'Asal Surat' : 'Tujuan Surat'}
            </label>
            <Input
              required
              placeholder='Nama instansi / pengirim / tujuan'
              value={asalTujuan}
              onChange={(e) => setAsalTujuan(e.target.value)}
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Perihal
            </label>
            <Input
              required
              placeholder='Ringkasan isi atau perihal surat'
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Pengantaran (Opsional)
              </label>
              <Input
                placeholder='Kurir / Email / Langsung'
                value={pengantaran}
                onChange={(e) => setPengantaran(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
              >
                <option value='Belum'>Belum</option>
                <option value='Diproses'>Diproses</option>
                <option value='Selesai'>Selesai</option>
                <option value='Sudah'>Sudah</option>
              </select>
            </div>
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
              disabled={submitting}
              className='bg-emerald-600 text-white hover:bg-emerald-700'
            >
              {submitting
                ? 'Menyimpan...'
                : isEdit
                  ? 'Simpan Perubahan'
                  : 'Simpan Surat'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
