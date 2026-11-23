'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlobalModal } from '@/components/shared/global-modal'

export function PegawaiDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Tambah Pegawai
      </Button>

      <GlobalModal
        open={open}
        onOpenChange={setOpen}
        title="Tambah Pegawai"
        description="Masukkan informasi data pegawai."
        size="lg"
      >
        <div className="py-4">
          Form pegawai akan dibuat di sini.
        </div>
      </GlobalModal>
    </>
  )
}
