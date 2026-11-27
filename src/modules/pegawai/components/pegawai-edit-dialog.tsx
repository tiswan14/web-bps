
'use client'

import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { PegawaiForm } from './pegawai-form'
import {
  getPegawaiById,
  updatePegawai,
} from '../services/pegawai-mutation.service'

import type { Pegawai } from '../types/pegawai.type'
import type {
  PegawaiDetail,
  UpdatePegawaiPayload,
} from '../services/pegawai-mutation.service'

type PegawaiEditDialogProps = {
  pegawai: Pegawai | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PegawaiEditDialog({
  pegawai,
  open,
  onOpenChange,
  onSuccess,
}: PegawaiEditDialogProps) {
  const [detail, setDetail] = useState<PegawaiDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !pegawai) return

    let cancelled = false

    const fetchDetail = async () => {
      setLoading(true)

      try {
        const result = await getPegawaiById(pegawai.id)

        if (!cancelled) {
          setDetail(result)
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Gagal mengambil detail pegawai',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchDetail()

    return () => {
      cancelled = true
    }
  }, [open, pegawai])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setDetail(null)
    }

    onOpenChange(nextOpen)
  }

  const handleUpdate = async (payload: UpdatePegawaiPayload) => {
    if (!pegawai) return

    await updatePegawai(pegawai.id, payload)

    handleOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Edit Pegawai</DialogTitle>
          <DialogDescription>
            Perbarui informasi kepegawaian dan data akun pegawai.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className='flex min-h-40 items-center justify-center'>
            <LoaderCircle className='size-6 animate-spin text-muted-foreground' />
          </div>
        ) : detail ? (
          <PegawaiForm
            key={detail.id}
            initialData={detail}
            onCreate={async () => {}}
            onUpdate={handleUpdate}
            onCancel={() => handleOpenChange(false)}
          />
        ) : (
          <div className='flex min-h-40 items-center justify-center text-sm text-muted-foreground'>
            Data pegawai belum tersedia.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
