'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, Wallet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/page-container'
import { PageHeader } from '@/components/shared/page-header'
import { PageToolbar } from '@/components/shared/page-toolbar'

import { PenugasanAnggaranTable } from '@/modules/penugasan-anggaran/components/penugasan-anggaran-table'
import { usePenugasanAnggaran } from '@/modules/penugasan-anggaran/hooks/use-penugasan-anggaran'
import type { PenugasanAnggaran } from '@/modules/penugasan-anggaran/services/penugasan-anggaran.service'

const jenisPenugasanLabel: Record<PenugasanAnggaran['jenis'], string> = {
  KUASA_PENGGUNA_ANGGARAN: 'Kuasa Pengguna Anggaran',
  PEJABAT_PENANDATANGAN_SURAT_PERINTAH_MEMBAYAR: 'Pejabat Penandatangan SPM',
  PEJABAT_PEMBUAT_KOMITMEN: 'Pejabat Pembuat Komitmen',
  PEJABAT_PENGADAAN_BARANG_DAN_JASA: 'Pejabat Pengadaan Barang dan Jasa',
  BENDAHARA_PENGELUARAN: 'Bendahara Pengeluaran',
}

export default function Page() {
  const [search, setSearch] = useState('')

  const {
    penugasan,
    loading,
    error,
  } = usePenugasanAnggaran()

  const filteredPenugasan = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    if (!keyword) return penugasan

    return penugasan.filter((item) =>
      [
        item.pegawai.nama,
        item.pegawai.nip,
        jenisPenugasanLabel[item.jenis],
      ].some((value) => value.toLowerCase().includes(keyword)),
    )
  }, [penugasan, search])

  return (
    <PageContainer>
      <PageHeader
        title='Pengelola Anggaran'
        description='Kelola penugasan pejabat pengelola anggaran'
      />

      <PageToolbar
        search={
          <div className='relative w-full sm:max-w-sm'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Cari nama, NIP, atau jabatan...'
              className='pl-9'
            />
          </div>
        }
        actions={
          <Button className='cursor-pointer'>
            <Plus className='size-4' />
            Tambah Penugasan
          </Button>
        }
      />

      {loading ? (
        <p className='text-sm text-muted-foreground'>
          Memuat data...
        </p>
      ) : error ? (
        <p className='text-sm text-destructive'>{error}</p>
      ) : (
        <>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Wallet className='size-4' />
            Menampilkan {filteredPenugasan.length} dari {penugasan.length} penugasan
          </div>

          <PenugasanAnggaranTable data={filteredPenugasan} />
        </>
      )}
    </PageContainer>
  )
}
