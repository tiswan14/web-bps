'use client'

import { useCallback, useEffect, useState } from 'react'
import { Mail, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/page-container'

import { SuratTable } from '@/modules/surat/components/surat-table'
import { DisposisiTable } from '@/modules/surat/components/disposisi-table'
import { CatatSuratModal } from '@/modules/surat/components/catat-surat-modal'
import {
  DetailSuratModal,
  HapusSuratModal,
} from '@/modules/surat/components/surat-action-modals'
import {
  DetailDisposisiModal,
  FormDisposisiModal,
  HapusDisposisiModal,
} from '@/modules/surat/components/disposisi-modals'
import {
  deleteSuratById,
  fetchSuratList,
  patchUpdateSurat,
  postCreateSurat,
} from '@/modules/surat/services/surat-api.service'
import {
  deleteDisposisiById,
  fetchDisposisiList,
  patchUpdateDisposisi,
  postCreateDisposisi,
} from '@/modules/disposisi/services/disposisi-api.service'
import type {
  CreateDisposisiInput,
  CreateSuratInput,
  DisposisiItem,
  JenisSurat,
  SuratItem,
} from '@/modules/surat/types'

type TabSurat = 'surat-masuk' | 'surat-keluar' | 'disposisi'

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabSurat>('surat-masuk')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [suratList, setSuratList] = useState<SuratItem[]>([])
  const [totalSurat, setTotalSurat] = useState(0)
  const [loadingSurat, setLoadingSurat] = useState(true)
  const [errorSurat, setErrorSurat] = useState<string | null>(null)

  const [disposisiList, setDisposisiList] = useState<DisposisiItem[]>([])
  const [totalDisposisi, setTotalDisposisi] = useState(0)
  const [loadingDisposisi, setLoadingDisposisi] = useState(false)
  const [errorDisposisi, setErrorDisposisi] = useState<string | null>(null)

  const [openSuratModal, setOpenSuratModal] = useState(false)
  const [editingSurat, setEditingSurat] = useState<SuratItem | null>(null)
  const [detailSurat, setDetailSurat] = useState<SuratItem | null>(null)
  const [deletingSurat, setDeletingSurat] = useState<SuratItem | null>(null)

  const [openDisposisiModal, setOpenDisposisiModal] = useState(false)
  const [editingDisposisi, setEditingDisposisi] =
    useState<DisposisiItem | null>(null)
  const [detailDisposisi, setDetailDisposisi] =
    useState<DisposisiItem | null>(null)
  const [deletingDisposisi, setDeletingDisposisi] =
    useState<DisposisiItem | null>(null)

  const isDisposisiTab = activeTab === 'disposisi'
  const currentJenis: JenisSurat =
    activeTab === 'surat-keluar' ? 'KELUAR' : 'MASUK'

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 350)

    return () => clearTimeout(timer)
  }, [search])

  const loadSurat = useCallback(async () => {
    try {
      setLoadingSurat(true)
      setErrorSurat(null)

      const result = await fetchSuratList({
        page,
        limit: pageSize,
        search: debouncedSearch,
        jenis: currentJenis,
      })

      setSuratList(result.items)
      setTotalSurat(result.meta.total)
    } catch (error) {
      setErrorSurat(
        error instanceof Error ? error.message : 'Gagal memuat data surat',
      )
    } finally {
      setLoadingSurat(false)
    }
  }, [page, pageSize, debouncedSearch, currentJenis])

  const loadDisposisi = useCallback(async () => {
    try {
      setLoadingDisposisi(true)
      setErrorDisposisi(null)

      const result = await fetchDisposisiList({
        page,
        limit: pageSize,
        search: debouncedSearch,
      })

      setDisposisiList(result.items)
      setTotalDisposisi(result.pagination.total)
    } catch (error) {
      setErrorDisposisi(
        error instanceof Error
          ? error.message
          : 'Gagal memuat data disposisi',
      )
    } finally {
      setLoadingDisposisi(false)
    }
  }, [page, pageSize, debouncedSearch])

  useEffect(() => {
    if (isDisposisiTab) {
      void loadDisposisi()
    } else {
      void loadSurat()
    }
  }, [isDisposisiTab, loadDisposisi, loadSurat])

  function handleTabChange(tab: TabSurat) {
    setActiveTab(tab)
    setSearch('')
    setDebouncedSearch('')
    setPage(1)
  }

  async function handleSimpanSurat(
    suratData: CreateSuratInput,
    editId?: string,
  ) {
    if (editId) {
      await patchUpdateSurat(editId, suratData)
      await loadSurat()
      return
    }

    await postCreateSurat(suratData)
    const targetTab: TabSurat =
      suratData.jenis === 'KELUAR' ? 'surat-keluar' : 'surat-masuk'

    if (activeTab !== targetTab) {
      setActiveTab(targetTab)
      setPage(1)
    } else if (page !== 1) {
      setPage(1)
    } else {
      await loadSurat()
    }
  }

  async function handleHapusSurat(id: string) {
    await deleteSuratById(id)
    if (suratList.length === 1 && page > 1) {
      setPage((prev) => prev - 1)
    } else {
      await loadSurat()
    }
  }

  async function handleSimpanDisposisi(
    data: CreateDisposisiInput,
    editId?: string,
  ) {
    if (editId) {
      await patchUpdateDisposisi(editId, data)
      await loadDisposisi()
      return
    }

    await postCreateDisposisi(data)
    if (page !== 1) {
      setPage(1)
    } else {
      await loadDisposisi()
    }
  }

  async function handleHapusDisposisi(id: string) {
    await deleteDisposisiById(id)
    if (disposisiList.length === 1 && page > 1) {
      setPage((prev) => prev - 1)
    } else {
      await loadDisposisi()
    }
  }

  return (
    <PageContainer>
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

      <div className='flex'>
        <div className='inline-flex rounded-lg bg-muted p-1'>
          <button
            type='button'
            onClick={() => handleTabChange('surat-masuk')}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'surat-masuk'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Surat Masuk
          </button>
          <button
            type='button'
            onClick={() => handleTabChange('surat-keluar')}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'surat-keluar'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Surat Keluar
          </button>
          <button
            type='button'
            onClick={() => handleTabChange('disposisi')}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'disposisi'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Disposisi
          </button>
        </div>
      </div>

      <div className='space-y-5 rounded-xl border bg-card p-6 shadow-sm'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              {activeTab === 'surat-masuk'
                ? 'Daftar Surat Masuk'
                : activeTab === 'surat-keluar'
                  ? 'Daftar Surat Keluar'
                  : 'Daftar Disposisi'}
            </h2>
            <p className='text-xs text-muted-foreground'>
              {activeTab === 'surat-masuk'
                ? 'Catat dan kelola surat masuk yang diterima instansi.'
                : activeTab === 'surat-keluar'
                  ? 'Catat dan kelola surat keluar yang dikirim atau diantarkan secara fisik.'
                  : 'Daftar penerusan disposisi surat masuk dan keluar internal.'}
            </p>
          </div>

          <Button
            type='button'
            onClick={() => {
              if (isDisposisiTab) {
                setEditingDisposisi(null)
                setOpenDisposisiModal(true)
              } else {
                setEditingSurat(null)
                setOpenSuratModal(true)
              }
            }}
            className='cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
          >
            <Plus className='size-4' />
            {activeTab === 'surat-masuk'
              ? 'Catat Surat Masuk'
              : activeTab === 'surat-keluar'
                ? 'Catat Surat Keluar'
                : 'Buat Disposisi'}
          </Button>
        </div>

        <div className='relative w-full sm:max-w-xs'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder={
              activeTab === 'surat-masuk'
                ? 'Cari nomor, asal surat, atau perihal...'
                : activeTab === 'surat-keluar'
                  ? 'Cari nomor, tujuan surat, atau perihal...'
                  : 'Cari nomor surat, perihal, atau penerima...'
            }
            className='pl-9'
          />
        </div>

        {!isDisposisiTab ? (
          errorSurat ? (
            <div className='flex flex-col items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive'>
              <p>{errorSurat}</p>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => void loadSurat()}
              >
                Coba Lagi
              </Button>
            </div>
          ) : loadingSurat ? (
            <div className='py-10 text-center text-sm text-muted-foreground'>
              Memuat data{' '}
              {activeTab === 'surat-masuk' ? 'surat masuk' : 'surat keluar'}...
            </div>
          ) : (
            <SuratTable
              data={suratList}
              jenis={currentJenis}
              page={page}
              pageSize={pageSize}
              totalItems={totalSurat}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              onDetailSurat={(surat) => setDetailSurat(surat)}
              onEditSurat={(surat) => {
                setEditingSurat(surat)
                setOpenSuratModal(true)
              }}
              onDeleteSurat={(surat) => setDeletingSurat(surat)}
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
            Memuat data disposisi...
          </div>
        ) : (
          <DisposisiTable
            data={disposisiList}
            page={page}
            pageSize={pageSize}
            totalItems={totalDisposisi}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
            onDetailDisposisi={(item) => setDetailDisposisi(item)}
            onEditDisposisi={(item) => {
              setEditingDisposisi(item)
              setOpenDisposisiModal(true)
            }}
            onDeleteDisposisi={(item) => setDeletingDisposisi(item)}
          />
        )}
      </div>

      <CatatSuratModal
        open={openSuratModal}
        defaultJenis={currentJenis}
        initialData={editingSurat}
        onClose={() => {
          setOpenSuratModal(false)
          setEditingSurat(null)
        }}
        onSubmit={handleSimpanSurat}
      />

      <DetailSuratModal
        surat={detailSurat}
        onClose={() => setDetailSurat(null)}
        onEdit={(surat) => {
          setEditingSurat(surat)
          setOpenSuratModal(true)
        }}
      />

      <HapusSuratModal
        surat={deletingSurat}
        onClose={() => setDeletingSurat(null)}
        onConfirm={handleHapusSurat}
      />

      <FormDisposisiModal
        open={openDisposisiModal}
        initialData={editingDisposisi}
        onClose={() => {
          setOpenDisposisiModal(false)
          setEditingDisposisi(null)
        }}
        onSubmit={handleSimpanDisposisi}
      />

      <DetailDisposisiModal
        disposisi={detailDisposisi}
        onClose={() => setDetailDisposisi(null)}
        onEdit={(item) => {
          setEditingDisposisi(item)
          setOpenDisposisiModal(true)
        }}
      />

      <HapusDisposisiModal
        disposisi={deletingDisposisi}
        onClose={() => setDeletingDisposisi(null)}
        onConfirm={handleHapusDisposisi}
      />
    </PageContainer>
  )
}
