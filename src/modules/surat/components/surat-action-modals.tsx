'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SuratItem } from '../types'

interface DetailSuratModalProps {
  surat: SuratItem | null
  onClose: () => void
  onEdit: (surat: SuratItem) => void
}

export function DetailSuratModal({
  surat,
  onClose,
  onEdit,
}: DetailSuratModalProps) {
  if (!surat) return null

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(surat.tanggal))

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between border-b pb-3'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>
              Detail Surat {surat.jenis === 'MASUK' ? 'Masuk' : 'Keluar'}
            </h2>
            <p className='text-xs text-muted-foreground'>{surat.nomor}</p>
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
            <dd className='font-medium text-foreground'>{surat.nomor}</dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Tanggal</dt>
            <dd className='font-medium text-foreground'>{formattedDate}</dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>
              {surat.jenis === 'MASUK' ? 'Asal Surat' : 'Tujuan Surat'}
            </dt>
            <dd className='font-medium text-foreground'>{surat.asalTujuan}</dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>Perihal</dt>
            <dd className='font-medium text-foreground'>{surat.perihal}</dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Sifat</dt>
            <dd className='font-medium text-foreground'>
              {surat.sifat === 'PENTING' ? 'Penting' : 'Biasa'}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Pengantaran</dt>
            <dd className='font-medium text-foreground'>
              {surat.pengantaran || '—'}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Status</dt>
            <dd className='font-medium text-foreground'>
              {surat.status || '—'}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Dicatat Oleh</dt>
            <dd className='font-medium text-foreground'>{surat.dicatatOleh}</dd>
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
              onEdit(surat)
            }}
          >
            Edit Surat
          </Button>
        </div>
      </div>
    </div>
  )
}

interface HapusSuratModalProps {
  surat: SuratItem | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function HapusSuratModal({
  surat,
  onClose,
  onConfirm,
}: HapusSuratModalProps) {
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!surat) return null

  async function handleDelete() {
    if (!surat) return
    try {
      setDeleting(true)
      setErrorMsg(null)
      await onConfirm(surat.id)
      onClose()
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : 'Gagal menghapus surat',
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
              Hapus Data Surat?
            </h2>
            <p className='text-xs text-muted-foreground'>
              Surat nomor <span className='font-semibold text-foreground'>{surat.nomor}</span> ({surat.perihal}) akan dihapus permanen.
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
