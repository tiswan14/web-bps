'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/page-container'
import { PageHeader } from '@/components/shared/page-header'
import { PageToolbar } from '@/components/shared/page-toolbar'

import { PegawaiTable } from '@/modules/pegawai/components/pegawai-table'
import { PegawaiFormDialog } from '@/modules/pegawai/components/pegawai-form-dialog'
import { PegawaiDetailDialog } from '@/modules/pegawai/components/pegawai-detail-dialog'
import { PegawaiEditDialog } from '@/modules/pegawai/components/pegawai-edit-dialog'
import { PegawaiDeleteDialog } from '@/modules/pegawai/components/pegawai-delete-dialog'

import type { Pegawai } from '@/modules/pegawai/types/pegawai.type'

export default function Page() {
  const [search, setSearch] = useState('')
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null)

  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshData = () => {
    setRefreshKey((previous) => previous + 1)
  }

  const handleDetail = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai)
    setDetailOpen(true)
  }

  const handleEdit = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai)
    setEditOpen(true)
  }

  const handleDelete = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai)
    setDeleteOpen(true)
  }

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
          <PegawaiFormDialog onSuccess={refreshData} />
        }
      />

      <PegawaiTable
        key={refreshKey}
        search={search}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PegawaiDetailDialog
        pegawai={selectedPegawai}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <PegawaiEditDialog
        pegawai={selectedPegawai}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={refreshData}
      />

      <PegawaiDeleteDialog
        pegawai={selectedPegawai}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={refreshData}
      />
    </PageContainer>
  )
}
