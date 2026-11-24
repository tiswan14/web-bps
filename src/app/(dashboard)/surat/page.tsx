'use client'

import { useState } from 'react'
import { Mail, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/page-container'

// Surat
import { CatatSuratModal } from '@/modules/surat/components/catat-surat-modal'
import {
  DetailSuratModal,
  HapusSuratModal,
} from '@/modules/surat/components/surat-action-modals'
import { SuratTable } from '@/modules/surat/components/surat-table'
import { SuratTabs } from '@/modules/surat/components/surat-tabs'
import { TAB_CONFIG } from '@/modules/surat/constants/surat-tabs'
import { useSurat } from '@/modules/surat/hooks/use-surat'
import { useSuratActions } from '@/modules/surat/hooks/use-surat-actions'
import { useSuratFilters } from '@/modules/surat/hooks/use-surat-filters'

// Disposisi (belum dipindah)
import { DisposisiTable } from '@/modules/surat/components/disposisi-table'
import {
  DetailDisposisiModal,
  FormDisposisiModal,
  HapusDisposisiModal,
} from '@/modules/surat/components/disposisi-modals'
import { useDisposisi } from '@/modules/surat/hooks/use-disposisi'

import type { DisposisiItem, SuratItem } from '@/modules/surat/types'

export default function Page() {
  // ---------------------------------------------------------------------------
  // Filters (tab, search, pagination)
  // ---------------------------------------------------------------------------
  const filters = useSuratFilters()
  const {
    activeTab,
    setActiveTab,
    search,
    debouncedSearch,
    page,
    setPage,
    pageSize,
  } = filters

  const config = TAB_CONFIG[activeTab]
  const isDisposisiTab = activeTab === 'disposisi'
  const currentJenis = config.jenis

  // ---------------------------------------------------------------------------
  // Surat: data + actions
  // ---------------------------------------------------------------------------
  const {
    data: suratList,
    pagination: suratPagination,
    loading: loadingSurat,
    error: errorSurat,
    refresh: refreshSurat,
    createSurat,
    updateSurat,
    deleteSurat,
  } = useSurat({
    page,
    limit: pageSize,
    search: debouncedSearch,
    jenis: currentJenis,
  })

  const suratActions = useSuratActions({
    activeTab,
    setActiveTab,
    page,
    setPage,
    suratList,
    refreshSurat,
    createSurat,
    updateSurat,
    deleteSurat,
  })

  // Surat modal state
  const [openSuratModal, setOpenSuratModal] = useState(false)
  const [editingSurat, setEditingSurat] = useState<SuratItem | null>(null)
  const [detailSurat, setDetailSurat] = useState<SuratItem | null>(null)
  const [deletingSurat, setDeletingSurat] = useState<SuratItem | null>(null)

  // ---------------------------------------------------------------------------
  // Disposisi: data + modal state
  // ---------------------------------------------------------------------------
  const {
    items: disposisiList,
    total: totalDisposisi,
    loading: loadingDisposisi,
    error: errorDisposisi,
    reload: loadDisposisi,
    save: handleSimpanDisposisi,
    remove: handleHapusDisposisi,
  } = useDisposisi({
    enabled: isDisposisiTab,
    page,
    pageSize,
    search: debouncedSearch,
    setPage,
  })

  const [openDisposisiModal, setOpenDisposisiModal] = useState(false)
  const [editingDisposisi, setEditingDisposisi] =
    useState<DisposisiItem | null>(null)
  const [detailDisposisi, setDetailDisposisi] =
    useState<DisposisiItem | null>(null)
  const [deletingDisposisi, setDeletingDisposisi] =
    useState<DisposisiItem | null>(null)

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  function handleAdd() {
    if (isDisposisiTab) {
      setEditingDisposisi(null)
      setOpenDisposisiModal(true)
      return
    }

    setEditingSurat(null)
    setOpenSuratModal(true)
  }

  function handleEditSurat(surat: SuratItem) {
    setEditingSurat(surat)
    setOpenSuratModal(true)
  }

  function handleCloseSuratModal() {
    setOpenSuratModal(false)
    setEditingSurat(null)
  }

  function handleEditDisposisi(item: DisposisiItem) {
    setEditingDisposisi(item)
    setOpenDisposisiModal(true)
  }

  function handleCloseDisposisiModal() {
    setOpenDisposisiModal(false)
    setEditingDisposisi(null)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <PageContainer>
      {/* Page header */}
      <div className='space-y-1'>
        <div className='flex items-center gap-2.5'>
          <Mail className='size-6 text-foreground' />

          <h1 className='text-2xl font-bold tracking-tight text-foreground'>
            Surat &amp; Disposisi
          </h1>
        </div>

        <p className='text-sm text-muted-foreground'>
          Pencatatan surat masuk/keluar dan penerusan disposisi internal.
        </p>
      </div>

      <SuratTabs activeTab={activeTab} onChange={filters.changeTab} />

      {/* Main content */}
      <div className='space-y-5 rounded-xl border bg-card p-6 shadow-sm'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              {config.title}
            </h2>

            <p className='text-xs text-muted-foreground'>
              {config.description}
            </p>
          </div>

          <Button
            type='button'
            onClick={handleAdd}
            className='cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
          >
            <Plus className='size-4' />
            {config.addLabel}
          </Button>
        </div>

        {/* Search */}
        <div className='relative w-full sm:max-w-xs'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

          <Input
            value={search}
            onChange={(event) => filters.changeSearch(event.target.value)}
            placeholder={config.searchPlaceholder}
            className='pl-9'
          />
        </div>

        {/* List */}
        {!isDisposisiTab ? (
          errorSurat ? (
            <div className='flex flex-col items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive'>
              <p>{errorSurat}</p>

              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => void refreshSurat()}
              >
                Coba Lagi
              </Button>
            </div>
          ) : loadingSurat ? (
            <div className='py-10 text-center text-sm text-muted-foreground'>
              {config.loadingLabel}
            </div>
          ) : (
            <SuratTable
              data={suratList}
              jenis={currentJenis}
              page={page}
              pageSize={pageSize}
              totalItems={suratPagination.total}
              onPageChange={setPage}
              onPageSizeChange={filters.changePageSize}
              onDetailSurat={setDetailSurat}
              onEditSurat={handleEditSurat}
              onDeleteSurat={setDeletingSurat}
            />
          )
        ) : errorDisposisi ? (
          <div className='flex flex-col items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive'>
            <p>{errorDisposisi}</p>

            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => void loadDisposisi()}
            >
              Coba Lagi
            </Button>
          </div>
        ) : loadingDisposisi ? (
          <div className='py-10 text-center text-sm text-muted-foreground'>
            {config.loadingLabel}
          </div>
        ) : (
          <DisposisiTable
            data={disposisiList}
            page={page}
            pageSize={pageSize}
            totalItems={totalDisposisi}
            onPageChange={setPage}
            onPageSizeChange={filters.changePageSize}
            onDetailDisposisi={setDetailDisposisi}
            onEditDisposisi={handleEditDisposisi}
            onDeleteDisposisi={setDeletingDisposisi}
          />
        )}
      </div>

      {/* Surat modals */}
      <CatatSuratModal
        open={openSuratModal}
        defaultJenis={currentJenis}
        initialData={editingSurat}
        onClose={handleCloseSuratModal}
        onSubmit={suratActions.save}
      />

      <DetailSuratModal
        surat={detailSurat}
        onClose={() => setDetailSurat(null)}
        onEdit={handleEditSurat}
      />

      <HapusSuratModal
        surat={deletingSurat}
        onClose={() => setDeletingSurat(null)}
        onConfirm={suratActions.remove}
      />

      {/* Disposisi modals */}
      <FormDisposisiModal
        open={openDisposisiModal}
        initialData={editingDisposisi}
        onClose={handleCloseDisposisiModal}
        onSubmit={handleSimpanDisposisi}
      />

      <DetailDisposisiModal
        disposisi={detailDisposisi}
        onClose={() => setDetailDisposisi(null)}
        onEdit={handleEditDisposisi}
      />

      <HapusDisposisiModal
        disposisi={deletingDisposisi}
        onClose={() => setDeletingDisposisi(null)}
        onConfirm={handleHapusDisposisi}
      />
    </PageContainer>
  )
}