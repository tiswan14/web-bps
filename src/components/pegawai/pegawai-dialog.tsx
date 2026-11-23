'use client'

import { useState } from 'react'
import { UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { GlobalModal } from '@/components/shared/global-modal'
import { PegawaiForm } from '@/modules/pegawai/components/pegawai-form'

interface PegawaiDialogProps {
  onSuccess: () => void | Promise<void>
}

export function PegawaiDialog({ onSuccess }: PegawaiDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = async () => {
    setOpen(false)
    await onSuccess()

    toast.success('Pegawai berhasil ditambahkan', {
      description: 'Data pegawai berhasil disimpan.',
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className='cursor-pointer gap-2'>
        <UserPlus className='size-4' />
        Tambah Pegawai
      </Button>

      <GlobalModal
        open={open}
        onOpenChange={setOpen}
        title='Tambah Pegawai'
        description='Lengkapi informasi identitas dan kepegawaian. Pastikan NIP yang dimasukkan sudah benar.'
        icon={Users}
        size='xl'
      >
        <PegawaiForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </GlobalModal>
    </>
  )
}