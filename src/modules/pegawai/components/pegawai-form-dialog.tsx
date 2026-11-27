
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { PegawaiForm } from './pegawai-form'
import { createPegawai } from '../services/pegawai-mutation.service'

import type { CreatePegawaiPayload } from '../services/pegawai-mutation.service'

type PegawaiFormDialogProps = {
  onSuccess: () => void
}

export function PegawaiFormDialog({
  onSuccess,
}: PegawaiFormDialogProps) {
  const [open, setOpen] = useState(false)

  const handleCreate = async (payload: CreatePegawaiPayload) => {
    await createPegawai(payload)
    setOpen(false)
    onSuccess()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className='size-4' />
        Tambah Pegawai
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Tambah Pegawai</DialogTitle>
            <DialogDescription>
              Lengkapi informasi akun pengguna terlebih dahulu,
              kemudian isi informasi pegawai.
            </DialogDescription>
          </DialogHeader>

          <PegawaiForm
            key={open ? 'open' : 'closed'}
            onCreate={handleCreate}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
