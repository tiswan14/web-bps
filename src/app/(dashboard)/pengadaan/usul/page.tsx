'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Filter,
  Info,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/page-container'

import {
  DAFTAR_BULAN,
  STATUS_PENGADAAN_CONFIG,
} from '@/modules/pengadaan/data/mock-pengadaan'
import {
  deletePengadaanById,
  fetchPengadaanList,
  patchUpdatePengadaan,
  postCreatePengadaan,
} from '@/modules/pengadaan/services/pengadaan-api.service'
import { PengadaanTable } from '@/modules/pengadaan/components/pengadaan-table'
import {
  DetailPengadaanModal,
  FormPengadaanModal,
  HapusPengadaanModal,
} from '@/modules/pengadaan/components/pengadaan-modals'
import type {
  CreatePengadaanInput,
  PengadaanItem,
  StatusPengadaan,
} from '@/modules/pengadaan/types'

function getRealtimeYear(): string {
  return String(new Date().getFullYear())
}

function getRealtimeYearOptions(): string[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, idx) => String(currentYear - 1 + idx))
}

export default function UsulPengadaanPage() {
  const [items, setItems] = useState<PengadaanItem[]>([])
  const [summary, setSummary] = useState({
    totalRencana: 0,
    totalRealisasi: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Default filter: Semua Bulan, Tahun kalender real-time, Semua Status
  const [selectedBulan, setSelectedBulan] = useState<string>('ALL')
  const [selectedTahun, setSelectedTahun] = useState<string>(() =>
    getRealtimeYear(),
  )
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  // State Modal
  const [openFormModal, setOpenFormModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PengadaanItem | null>(null)
  const [detailItem, setDetailItem] = useState<PengadaanItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<PengadaanItem | null>(null)

  const daftarTahun = getRealtimeYearOptions()

  const loadPengadaan = useCallback(async () => {
    try {
      setLoading(true)
      setErrorMsg(null)
      const res = await fetchPengadaanList({
        bulan: selectedBulan,
        tahun: selectedTahun,
        status: selectedStatus,
        search: searchQuery.trim(),
        page,
        limit: 10,
      })
      setItems(res.items)
      setSummary(res.summary)
      setPagination(res.pagination)
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Gagal memuat data pengadaan dari server',
      )
    } finally {
      setLoading(false)
    }
  }, [selectedBulan, selectedTahun, selectedStatus, searchQuery, page])

  useEffect(() => {
    void loadPengadaan()
  }, [loadPengadaan])

  const namaBulanAktif =
    selectedBulan === 'ALL'
      ? 'Semua Bulan'
      : (DAFTAR_BULAN.find((b) => b.value === selectedBulan)?.label ??
        selectedBulan)

  const periodeLabel =
    selectedBulan === 'ALL'
      ? `Semua Bulan (${selectedTahun})`
      : `${namaBulanAktif} ${selectedTahun}`

  function handleResetFilter() {
    setSelectedBulan('ALL')
    setSelectedTahun(getRealtimeYear())
    setSelectedStatus('ALL')
    setSearchQuery('')
    setPage(1)
  }

  async function handleSimpanPengadaan(
    input: CreatePengadaanInput,
    editId?: string,
  ) {
    if (editId) {
      await patchUpdatePengadaan(editId, input)
    } else {
      await postCreatePengadaan(input)
    }
    await loadPengadaan()
  }

  async function handleHapusPengadaan(id: string) {
    await deletePengadaanById(id)
    await loadPengadaan()
  }

  return (
    <PageContainer>
      {/* Header Judul Halaman */}
      <div className='space-y-1'>
        <div className='flex items-center gap-2.5'>
          <ShoppingCart className='size-6 text-emerald-600' />
          <h1 className='text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400'>
            Input Data Pengadaan
          </h1>
        </div>
        <p className='text-sm text-muted-foreground'>
          Sistem rekam data pengadaan barang/jasa BPS Kabupaten Pangandaran
        </p>
      </div>

      {/* Card Filter Data */}
      <div className='space-y-4 rounded-xl border bg-card p-5 shadow-sm'>
        <div className='flex flex-wrap items-center gap-2'>
          <Filter className='size-4 text-foreground' />
          <h2 className='text-sm font-semibold text-foreground'>Filter Data</h2>
          <span className='text-xs text-muted-foreground'>
            (Bulan: {namaBulanAktif}, Tahun: {selectedTahun})
          </span>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end'>
          {/* Dropdown Bulan */}
          <div className='space-y-1.5 md:col-span-2'>
            <label className='text-xs font-medium text-foreground'>Bulan</label>
            <select
              value={selectedBulan}
              onChange={(e) => {
                setSelectedBulan(e.target.value)
                setPage(1)
              }}
              className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
            >
              <option value='ALL'>Semua Bulan</option>
              {DAFTAR_BULAN.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Tahun Anggaran */}
          <div className='space-y-1.5 md:col-span-2'>
            <label className='text-xs font-medium text-foreground'>
              Tahun Anggaran
            </label>
            <select
              value={selectedTahun}
              onChange={(e) => {
                setSelectedTahun(e.target.value)
                setPage(1)
              }}
              className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
            >
              {daftarTahun.map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Status */}
          <div className='space-y-1.5 md:col-span-2'>
            <label className='text-xs font-medium text-foreground'>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(1)
              }}
              className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
            >
              <option value='ALL'>Semua Status</option>
              {(
                Object.entries(STATUS_PENGADAAN_CONFIG) as [
                  StatusPengadaan,
                  { label: string },
                ][]
              ).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Input Cari Data */}
          <div className='space-y-1.5 md:col-span-4'>
            <label className='text-xs font-medium text-foreground'>
              Cari Data
            </label>
            <div className='relative'>
              <Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                placeholder='Cari nama produk, detil POK, kode POK...'
                className='h-9 w-full rounded-md border bg-background pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
              />
            </div>
          </div>

          {/* Tombol Tambah Pengadaan */}
          <div className='flex flex-wrap items-center gap-2 md:col-span-2 md:justify-end'>
            <Button
              type='button'
              onClick={() => {
                setEditingItem(null)
                setOpenFormModal(true)
              }}
              className='w-full cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
            >
              <Plus className='size-4' />
              Tambah Pengadaan
            </Button>
          </div>
        </div>

        <div className='flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between'>
          {/* Banner Info Role */}
          <div className='flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'>
            <Info className='mt-0.5 size-3.5 shrink-0' />
            <span>
              <strong>Info:</strong> PPK, Bendahara, Operator, dan Admin dapat
              menambah, mengubah, maupun menghapus data pengadaan barang/jasa.
            </span>
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleResetFilter}
            className='shrink-0 cursor-pointer'
          >
            <RotateCcw className='size-3.5' />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Tabel Data Pengadaan */}
      {errorMsg ? (
        <div className='flex flex-col items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive'>
          <p>{errorMsg}</p>
          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={() => void loadPengadaan()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : loading ? (
        <div className='rounded-xl border bg-card py-12 text-center text-sm text-muted-foreground'>
          Memuat data pengadaan...
        </div>
      ) : (
        <PengadaanTable
          data={items}
          periodeLabel={periodeLabel}
          summary={summary}
          pagination={pagination}
          onPageChange={(nextPage) => setPage(nextPage)}
          onDetail={(item) => setDetailItem(item)}
          onEdit={(item) => {
            setEditingItem(item)
            setOpenFormModal(true)
          }}
          onDelete={(item) => setDeletingItem(item)}
        />
      )}

      {/* Modal Tambah/Edit, Detail & Hapus */}
      <FormPengadaanModal
        open={openFormModal}
        initialData={editingItem}
        onClose={() => {
          setOpenFormModal(false)
          setEditingItem(null)
        }}
        onSubmit={handleSimpanPengadaan}
      />

      <DetailPengadaanModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => {
          setEditingItem(item)
          setOpenFormModal(true)
        }}
      />

      <HapusPengadaanModal
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleHapusPengadaan}
      />
    </PageContainer>
  )
}
