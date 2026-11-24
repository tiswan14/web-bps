'use client'

import { useMemo, useState } from 'react'
import { Building2, Search, Wallet } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/page-container'
import { PageHeader } from '@/components/shared/page-header'
import { PageToolbar } from '@/components/shared/page-toolbar'

import { PegawaiTable } from '@/modules/pegawai/components/pegawai-table'
import { usePegawai } from '@/modules/pegawai/hooks/use-pegawai'

import { PenugasanAnggaranTable } from '@/modules/penugasan-anggaran/components/penugasan-anggaran-table'
import { usePenugasanAnggaran } from '@/modules/penugasan-anggaran/hooks/use-penugasan-anggaran'

import type { PegawaiKategori } from '@/modules/pegawai/services/pegawai.service'
import { PegawaiDialog } from '@/components/pegawai/pegawai-dialog'
import { PenugasanDialog } from '@/components/pegawai/penugasan-dialog'

const jenisPenugasanLabel = {
  KUASA_PENGGUNA_ANGGARAN: 'Kuasa Pengguna Anggaran',
  PEJABAT_PENANDATANGAN_SURAT_PERINTAH_MEMBAYAR: 'Pejabat Penandatangan SPM',
  PEJABAT_PEMBUAT_KOMITMEN: 'Pejabat Pembuat Komitmen',
  PEJABAT_PENGADAAN_BARANG_DAN_JASA: 'Pejabat Pengadaan Barang dan Jasa',
  BENDAHARA_PENGELUARAN: 'Bendahara Pengeluaran',
}

export default function Page() {
  const [kategori, setKategori] = useState<PegawaiKategori>('organik')
  const [search, setSearch] = useState('')

  const {
    pegawai,
    loading: loadingPegawai,
    error: errorPegawai,
    pagination,
    refresh: refreshPegawai,
  } = usePegawai('organik')

  const {
    penugasan,
    loading: loadingPenugasan,
    error: errorPenugasan,
  } = usePenugasanAnggaran()

  const isOrganik = kategori === 'organik'

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

  const loading = isOrganik ? loadingPegawai : loadingPenugasan
  const error = isOrganik ? errorPegawai : errorPenugasan

  const totalData = isOrganik
    ? pagination?.total ?? 0
    : penugasan.length

  const filteredData = isOrganik
    ? filteredPegawai.length
    : filteredPenugasan.length

  return (
    <PageContainer>
      <PageHeader
        title='Data Pegawai'
        description='Kelola dan pantau data pegawai'
      />

      <div className='flex'>
        <div className='inline-flex w-full max-w-75 rounded-lg bg-muted p-1'>
          <button
            type='button'
            onClick={() => {
              setKategori('organik')
              setSearch('')
            }}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${isOrganik
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Building2 className='size-3.5' />
            Organik BPS
          </button>

          <button
            type='button'
            onClick={() => {
              setKategori('pengelola-anggaran')
              setSearch('')
            }}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${!isOrganik
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Wallet className='size-3.5' />
            Pengelola Anggaran
          </button>
        </div>
      </div>

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
          isOrganik ? (
            <PegawaiDialog onSuccess={refreshPegawai} />) : (
            <PenugasanDialog />
          )
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
            Menampilkan {filteredData} dari {totalData} data
          </div>

          {isOrganik ? (
            <PegawaiTable
              data={pegawai}
              showFungsi={false}
            />
          ) : (
            <PenugasanAnggaranTable
              data={filteredPenugasan}
            />
          )}
        </>
      )}
    </PageContainer>
  )
}