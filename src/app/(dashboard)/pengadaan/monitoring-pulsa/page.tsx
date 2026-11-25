'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download, RefreshCw, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/page-container'

import type {
  CreateAjuanPulsaInput,
  MasterMitraOption,
  MonitoringPulsaResponse,
  PulsaAlokasiDetail,
  PulsaKegiatanItem,
  StatusPersetujuanPulsa,
  UpdateKegiatanPulsaInput,
} from '@/modules/monitoring-pulsa/types'
import {
  DAFTAR_BULAN_PULSA,
  getNamaBulan,
  getRealtimeYearOptions,
} from '@/modules/monitoring-pulsa/utils/format'
import { exportMonitoringPulsaToExcel } from '@/modules/monitoring-pulsa/utils/export-excel'
import {
  bulkVerifyKegiatanApi,
  deleteKegiatanPulsaApi,
  fetchMonitoringPulsa,
  submitAjuanPulsa,
  updateKegiatanPulsaApi,
  verifyAlokasiPulsaApi,
} from '@/modules/monitoring-pulsa/services/pulsa-api.client'
import { DaftarPulsaTab } from '@/modules/monitoring-pulsa/components/daftar-pulsa-tab'
import { TambahAjuanTab } from '@/modules/monitoring-pulsa/components/tambah-ajuan-tab'
import { LaporanPulsaTab } from '@/modules/monitoring-pulsa/components/laporan-pulsa-tab'
import { EditKegiatanModal } from '@/modules/monitoring-pulsa/components/edit-kegiatan-modal'

type ActiveTab = 'DAFTAR' | 'TAMBAH' | 'LAPORAN'

export default function MonitoringPulsaPage() {
  const [selectedBulan, setSelectedBulan] = useState<number>(
    () => new Date().getMonth() + 1,
  )
  const [selectedTahun, setSelectedTahun] = useState<number>(() =>
    new Date().getFullYear(),
  )
  const [activeTab, setActiveTab] = useState<ActiveTab>('DAFTAR')

  const [data, setData] = useState<MonitoringPulsaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingAlokasiId, setUpdatingAlokasiId] = useState<string | null>(null)
  const [editingKegiatan, setEditingKegiatan] =
    useState<PulsaKegiatanItem | null>(null)

  const loadData = useCallback(
    async (bulan = selectedBulan, tahun = selectedTahun) => {
      try {
        setLoading(true)
        const res = await fetchMonitoringPulsa(bulan, tahun)
        setData(res)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Gagal memuat data monitoring pulsa.',
        )
      } finally {
        setLoading(false)
      }
    },
    [selectedBulan, selectedTahun],
  )

  useEffect(() => {
    void loadData(selectedBulan, selectedTahun)
  }, [loadData, selectedBulan, selectedTahun])

  async function handleRefresh() {
    const now = new Date()
    const realtimeBulan = now.getMonth() + 1
    const realtimeTahun = now.getFullYear()
    setSelectedBulan(realtimeBulan)
    setSelectedTahun(realtimeTahun)
    await loadData(realtimeBulan, realtimeTahun)
  }

  const periodeAktifLabel = `${getNamaBulan(selectedBulan)} ${selectedTahun}`

  async function handleCreateAjuan(input: CreateAjuanPulsaInput) {
    try {
      const res = await submitAjuanPulsa(input)
      toast.success(res.message)
      setSelectedBulan(input.bulan)
      setSelectedTahun(input.tahun)
      setActiveTab('DAFTAR')
      await loadData(input.bulan, input.tahun)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal menyimpan ajuan pulsa.',
      )
      throw error
    }
  }

  async function handleToggleStatusAlokasi(
    alokasi: PulsaAlokasiDetail,
    nextStatus: StatusPersetujuanPulsa,
  ) {
    try {
      setUpdatingAlokasiId(alokasi.id)
      await verifyAlokasiPulsaApi(alokasi.id, nextStatus)
      toast.success(
        `Status ${alokasi.namaPetugas} diubah menjadi ${nextStatus}.`,
      )
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal memperbarui status.',
      )
    } finally {
      setUpdatingAlokasiId(null)
    }
  }

  async function handleBulkApproveKegiatan(
    kegiatanId: string,
    status: StatusPersetujuanPulsa,
  ) {
    try {
      const res = await bulkVerifyKegiatanApi(kegiatanId, status)
      toast.success(res.message)
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal verifikasi massal.',
      )
    }
  }

  async function handleUpdateKegiatan(
    kegiatanId: string,
    input: UpdateKegiatanPulsaInput,
  ) {
    try {
      const res = await updateKegiatanPulsaApi(kegiatanId, input)
      toast.success(res.message)
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal memperbarui kegiatan.',
      )
      throw error
    }
  }

  async function handleDeleteKegiatan(kegiatan: PulsaKegiatanItem) {
    const confirmed = window.confirm(
      `Hapus kegiatan "${kegiatan.namaKegiatan}" beserta seluruh ${kegiatan.jumlahPetugas} alokasi petugasnya?`,
    )
    if (!confirmed) return

    try {
      const res = await deleteKegiatanPulsaApi(kegiatan.id)
      toast.success(res.message)
      await loadData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal menghapus kegiatan.',
      )
    }
  }

  function handleMitraCreated(newMitra: MasterMitraOption) {
    setData((prev) =>
      prev
        ? {
            ...prev,
            masterMitra: [...prev.masterMitra, newMitra].sort((a, b) =>
              a.nama.localeCompare(b.nama, 'id'),
            ),
          }
        : prev,
    )
  }

  return (
    <PageContainer>
      {/* Header Halaman + Tombol Refresh & Export Excel */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2.5'>
            <Smartphone className='size-6 text-emerald-600' />
            <h1 className='text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400'>
              Manajemen Pembelian Pulsa / Paket Data
            </h1>
          </div>
          <p className='text-sm text-muted-foreground'>
            Kelola pembelian pulsa dan paket data untuk petugas lapangan BPS Kabupaten Pangandaran
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => void handleRefresh()}
            disabled={loading}
            className='cursor-pointer'
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={!data || data.kegiatanList.length === 0}
            onClick={() => data && exportMonitoringPulsaToExcel(data)}
            className='cursor-pointer'
          >
            <Download className='size-3.5' />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Card Filter Periode Aktif */}
      <div className='flex flex-wrap items-end gap-4 rounded-xl border bg-card p-4 shadow-sm'>
        <div className='space-y-1'>
          <label className='text-xs font-medium text-muted-foreground'>
            Bulan
          </label>
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(Number(e.target.value))}
            className='block h-9 min-w-[92px] rounded-md border bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-600/30'
          >
            {DAFTAR_BULAN_PULSA.map((b) => (
              <option key={b.value} value={b.value}>
                {b.short}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1'>
          <label className='text-xs font-medium text-muted-foreground'>
            Tahun
          </label>
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(Number(e.target.value))}
            className='block h-9 min-w-[105px] rounded-md border bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-600/30'
          >
            {getRealtimeYearOptions().map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-0.5 pb-0.5'>
          <p className='text-[11px] text-muted-foreground'>Periode Aktif</p>
          <p className='text-base font-semibold text-foreground'>
            {periodeAktifLabel}
          </p>
        </div>
      </div>

      {/* Bar Navigasi 3 Tab */}
      <div className='grid grid-cols-3 rounded-lg border bg-muted/60 p-1 text-xs font-medium'>
        <button
          type='button'
          onClick={() => setActiveTab('DAFTAR')}
          className={`cursor-pointer rounded-md px-3 py-2 transition ${
            activeTab === 'DAFTAR'
              ? 'bg-background font-semibold text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Daftar Pulsa
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('TAMBAH')}
          className={`cursor-pointer rounded-md px-3 py-2 transition ${
            activeTab === 'TAMBAH'
              ? 'bg-background font-semibold text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tambah Ajuan Pulsa/Paket Data
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('LAPORAN')}
          className={`cursor-pointer rounded-md px-3 py-2 transition ${
            activeTab === 'LAPORAN'
              ? 'bg-background font-semibold text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Laporan
        </button>
      </div>

      {/* Konten Tab Aktif */}
      {loading && !data ? (
        <div className='rounded-xl border bg-card py-12 text-center text-sm text-muted-foreground'>
          Memuat data monitoring pulsa...
        </div>
      ) : !data ? null : (
        <>
          {activeTab === 'DAFTAR' && (
            <DaftarPulsaTab
              kegiatanList={data.kegiatanList}
              petugasRows={data.petugasRows}
              canApprove={data.canApprove}
              updatingAlokasiId={updatingAlokasiId}
              onToggleStatusAlokasi={handleToggleStatusAlokasi}
            />
          )}

          {activeTab === 'TAMBAH' && (
            <TambahAjuanTab
              defaultBulan={selectedBulan}
              defaultTahun={selectedTahun}
              masterPegawai={data.masterPegawai}
              masterMitra={data.masterMitra}
              existingKegiatanNames={data.kegiatanList.map(
                (k) => k.namaKegiatan,
              )}
              onSubmitAjuan={handleCreateAjuan}
              onMitraCreated={handleMitraCreated}
            />
          )}

          {activeTab === 'LAPORAN' && (
            <LaporanPulsaTab
              periodeLabel={data.periode.label}
              summary={data.summary}
              kegiatanList={data.kegiatanList}
              petugasRows={data.petugasRows}
              canManage={data.canManage}
              canApprove={data.canApprove}
              updatingAlokasiId={updatingAlokasiId}
              onEditKegiatan={(keg) => setEditingKegiatan(keg)}
              onDeleteKegiatan={handleDeleteKegiatan}
              onBulkApproveKegiatan={handleBulkApproveKegiatan}
              onVerifyAlokasi={handleToggleStatusAlokasi}
            />
          )}

          <EditKegiatanModal
            kegiatan={editingKegiatan}
            masterPegawai={data.masterPegawai}
            masterMitra={data.masterMitra}
            onClose={() => setEditingKegiatan(null)}
            onSave={handleUpdateKegiatan}
          />
        </>
      )}
    </PageContainer>
  )
}
