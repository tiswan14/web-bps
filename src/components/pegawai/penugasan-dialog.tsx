'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GlobalModal } from '@/components/shared/global-modal'

const jenisPenugasan = [
  {
    value: 'KUASA_PENGGUNA_ANGGARAN',
    label: 'Kuasa Pengguna Anggaran',
  },
  {
    value: 'PEJABAT_PENANDATANGAN_SURAT_PERINTAH_MEMBAYAR',
    label: 'Pejabat Penandatangan SPM',
  },
  {
    value: 'PEJABAT_PEMBUAT_KOMITMEN',
    label: 'Pejabat Pembuat Komitmen',
  },
  {
    value: 'PEJABAT_PENGADAAN_BARANG_DAN_JASA',
    label: 'Pejabat Pengadaan Barang dan Jasa',
  },
  {
    value: 'BENDAHARA_PENGELUARAN',
    label: 'Bendahara Pengeluaran',
  },
]

export function PenugasanDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        className='cursor-pointer'
        onClick={() => setOpen(true)}
      >
        <Plus className='size-4' />
        Tambah Penugasan
      </Button>

      <GlobalModal
        open={open}
        onOpenChange={setOpen}
        title='Tambah Penugasan Anggaran'
        description='Tambahkan pegawai ke dalam penugasan anggaran.'
        size='lg'
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='pegawaiId'
              className='text-sm font-medium'
            >
              Pegawai
            </label>

            <select
              id='pegawaiId'
              className='h-10 w-full rounded-md border border-input bg-background px-3 text-sm'
              defaultValue=''
            >
              <option value='' disabled>
                Pilih pegawai
              </option>
            </select>
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='periodeId'
              className='text-sm font-medium'
            >
              Periode
            </label>

            <select
              id='periodeId'
              className='h-10 w-full rounded-md border border-input bg-background px-3 text-sm'
              defaultValue=''
            >
              <option value='' disabled>
                Pilih tahun
              </option>
              {Array.from({ length: 5 }, (_, index) => {
                const tahun = new Date().getFullYear() - index

                return (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                )
              })}
            </select>
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='jenis'
              className='text-sm font-medium'
            >
              Jenis Penugasan
            </label>

            <select
              id='jenis'
              className='h-10 w-full rounded-md border border-input bg-background px-3 text-sm'
              defaultValue=''
            >
              <option value='' disabled>
                Pilih jenis penugasan
              </option>

              {jenisPenugasan.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlobalModal>
    </>
  )
}
