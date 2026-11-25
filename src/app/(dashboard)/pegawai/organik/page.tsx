
'use client'

import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/page-container'
import { PageHeader } from '@/components/shared/page-header'
import { PageToolbar } from '@/components/shared/page-toolbar'

import { PegawaiTable } from '@/modules/pegawai/components/pegawai-table'
import { usePegawai } from '@/modules/pegawai/hooks/use-pegawai'

export default function Page() {
  const [search, setSearch] = useState('')

  const {
    pegawai,
    loading,
    error,
    pagination,
  } = usePegawai('organik')

  const filteredPegawai = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    if (!keyword) return pegawai

    return pegawai.filter((item) =>
      [
        item.nama,
        item.nip,
        item.nipBps,
        item.jabatan,
      ].some((value) => value?.toLowerCase().includes(keyword)),
    )
  }, [pegawai, search])

  return (
    <PageContainer>
      <PageHeader
        title='Data Pegawai'
        description='Kelola dan pantau data pegawai organik BPS'
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
            Tambah Pegawai
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
          <div className='text-sm text-muted-foreground'>
            Menampilkan {filteredPegawai.length} dari {pagination?.total ?? 0} pegawai
          </div>

          <PegawaiTable
            data={filteredPegawai}
            showFungsi={false}
          />
        </>
      )}
    </PageContainer>
  )
}
