
'use client'

import { useState } from 'react'
import { LoaderCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { deletePegawai } from '../services/pegawai-mutation.service'
import type { Pegawai } from '../types/pegawai.type'

type PegawaiDeleteDialogProps = {
  pegawai: Pegawai | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PegawaiDeleteDialog({
  pegawai,
  open,
  onOpenChange,
  onSuccess,
}: PegawaiDeleteDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!pegawai || loading) return

    setLoading(true)

    try {
      await toast.promise(deletePegawai(pegawai.id), {
        loading: 'Menghapus data pegawai...',
        success: 'Data pegawai berhasil dihapus',
        error: (error) =>
          error instanceof Error
            ? error.message
            : 'Gagal menghapus pegawai',
      })

      onOpenChange(false)
      onSuccess()
    } catch {
      // Error sudah ditampilkan melalui Sonner.
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive'>
              <Trash2 className='size-4' />
            </div>
            Hapus Pegawai
          </DialogTitle>

          <DialogDescription>
            Apakah kamu yakin ingin menghapus data pegawai ini?
            Data yang sudah dihapus tidak dapat dipulihkan.
          </DialogDescription>
        </DialogHeader>

        {pegawai && (
          <div className='rounded-lg border bg-muted/30 p-3'>
            <p className='text-sm font-semibold'>
              {pegawai.nama}
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              NIP: {pegawai.nipBaru}
            </p>
          </div>
        )}

        <div className='flex justify-end gap-2 border-t pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>

          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={loading || !pegawai}
          >
            {loading ? (
              <LoaderCircle className='size-4 animate-spin' />
            ) : (
              <Trash2 className='size-4' />
            )}

            {loading ? 'Menghapus...' : 'Hapus Pegawai'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
