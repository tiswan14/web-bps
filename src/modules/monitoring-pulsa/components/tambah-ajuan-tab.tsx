'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Info,
  Plus,
  RotateCcw,
  Save,
  UserPlus,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type {
  CreateAjuanPulsaInput,
  MasterMitraOption,
  MasterPegawaiOption,
} from '../types'
import {
  DAFTAR_BULAN_PULSA,
  formatRupiah,
  getNamaBulan,
  getRealtimeYearOptions,
} from '../utils/format'
import { createMitraQuickApi } from '../services/pulsa-api.client'

interface TambahAjuanTabProps {
  defaultBulan: number
  defaultTahun: number
  masterPegawai: MasterPegawaiOption[]
  masterMitra: MasterMitraOption[]
  existingKegiatanNames: string[]
  onSubmitAjuan: (input: CreateAjuanPulsaInput) => Promise<void>
  onMitraCreated: (mitra: MasterMitraOption) => void
}

export function TambahAjuanTab({
  defaultBulan,
  defaultTahun,
  masterPegawai,
  masterMitra,
  existingKegiatanNames,
  onSubmitAjuan,
  onMitraCreated,
}: TambahAjuanTabProps) {
  const [bulan, setBulan] = useState<number>(defaultBulan)
  const [tahun, setTahun] = useState<number>(defaultTahun)
  const [selectedPegawaiIds, setSelectedPegawaiIds] = useState<string[]>([])
  const [selectedMitraIds, setSelectedMitraIds] = useState<string[]>([])
  const [namaKegiatan, setNamaKegiatan] = useState('')
  const [nominal, setNominal] = useState<string>('0')
  const [keterangan, setKeterangan] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Quick Add Mitra inline
  const [showAddMitra, setShowAddMitra] = useState(false)
  const [newMitraNama, setNewMitraNama] = useState('')
  const [newMitraSobat, setNewMitraSobat] = useState('')
  const [newMitraHp, setNewMitraHp] = useState('')
  const [savingMitra, setSavingMitra] = useState(false)

  useEffect(() => {
    setBulan(defaultBulan)
    setTahun(defaultTahun)
  }, [defaultBulan, defaultTahun])

  const selectedPegawaiList = useMemo(
    () => masterPegawai.filter((p) => selectedPegawaiIds.includes(p.id)),
    [masterPegawai, selectedPegawaiIds],
  )

  const selectedMitraList = useMemo(
    () => masterMitra.filter((m) => selectedMitraIds.includes(m.id)),
    [masterMitra, selectedMitraIds],
  )

  const nominalNumber = Math.max(0, Number(nominal) || 0)
  const totalOrang = selectedPegawaiList.length + selectedMitraList.length
  const totalNominal = nominalNumber * totalOrang

  function handleAddPegawai(id: string) {
    if (!id || selectedPegawaiIds.includes(id)) return
    setSelectedPegawaiIds((prev) => [...prev, id])
  }

  function handleAddMitra(id: string) {
    if (!id || selectedMitraIds.includes(id)) return
    setSelectedMitraIds((prev) => [...prev, id])
  }

  function handleResetForm() {
    setSelectedPegawaiIds([])
    setSelectedMitraIds([])
    setNamaKegiatan('')
    setNominal('0')
    setKeterangan('')
  }

  async function handleQuickCreateMitra() {
    if (!newMitraNama.trim()) {
      toast.error('Nama mitra statistik wajib diisi.')
      return
    }
    try {
      setSavingMitra(true)
      const created = await createMitraQuickApi({
        nama: newMitraNama.trim(),
        sobatId: newMitraSobat.trim() || undefined,
        noHp: newMitraHp.trim() || undefined,
      })
      onMitraCreated(created)
      setSelectedMitraIds((prev) => [...prev, created.id])
      setNewMitraNama('')
      setNewMitraSobat('')
      setNewMitraHp('')
      setShowAddMitra(false)
      toast.success(`Mitra "${created.nama}" ditambahkan ke master & dipilih.`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Gagal menambah mitra.',
      )
    } finally {
      setSavingMitra(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!namaKegiatan.trim()) {
      toast.error('Nama kegiatan wajib diisi.')
      return
    }
    if (nominalNumber < 1000) {
      toast.error('Nominal pulsa minimal Rp 1.000.')
      return
    }
    if (totalOrang === 0) {
      toast.error('Pilih minimal 1 petugas Organik atau Mitra Statistik.')
      return
    }

    try {
      setSubmitting(true)
      await onSubmitAjuan({
        bulan,
        tahun,
        namaKegiatan: namaKegiatan.trim(),
        nominalPerOrang: nominalNumber,
        keterangan: keterangan.trim() || undefined,
        pegawaiIds: selectedPegawaiIds,
        mitraIds: selectedMitraIds,
      })
      handleResetForm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-5 rounded-xl border bg-card p-6 shadow-sm'
    >
      <div className='flex items-center gap-2 border-b pb-3'>
        <Info className='size-4 text-emerald-600' />
        <h2 className='text-base font-semibold text-foreground'>
          Tambah Ajuan Pulsa/Paket Data
        </h2>
      </div>

      {/* Baris 1: Bulan & Tahun */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-foreground'>Bulan</label>
          <select
            value={bulan}
            onChange={(e) => setBulan(Number(e.target.value))}
            className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
          >
            {DAFTAR_BULAN_PULSA.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-foreground'>Tahun</label>
          <select
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
          >
            {getRealtimeYearOptions().map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Baris 2: Nama Organik & Nama Mitra Statistik */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Organik */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-foreground'>
              Nama Organik
            </label>
            {selectedPegawaiIds.length > 0 && (
              <button
                type='button'
                onClick={() => setSelectedPegawaiIds([])}
                className='text-[11px] text-rose-600 hover:underline'
              >
                Hapus semua ({selectedPegawaiIds.length})
              </button>
            )}
          </div>
          <select
            value=''
            onChange={(e) => handleAddPegawai(e.target.value)}
            className='h-9 w-full rounded-md border border-orange-300 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-orange-800'
          >
            <option value=''>Pilih organik (opsional)...</option>
            {masterPegawai
              .filter((p) => !selectedPegawaiIds.includes(p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} ({p.nip})
                </option>
              ))}
          </select>

          {selectedPegawaiList.length > 0 && (
            <div className='flex flex-wrap gap-1.5 pt-1'>
              {selectedPegawaiList.map((p) => (
                <span
                  key={p.id}
                  className='inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300'
                >
                  {p.nama}
                  <button
                    type='button'
                    onClick={() =>
                      setSelectedPegawaiIds((prev) =>
                        prev.filter((id) => id !== p.id),
                      )
                    }
                    className='rounded-full p-0.5 hover:bg-orange-200/70'
                  >
                    <X className='size-3' />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mitra Statistik */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-foreground'>
              Nama Mitra Statistik
            </label>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => setShowAddMitra((prev) => !prev)}
                className='inline-flex items-center gap-1 text-[11px] font-medium text-sky-600 hover:underline dark:text-sky-400'
              >
                <UserPlus className='size-3' />
                Tambah Mitra Baru
              </button>
              {selectedMitraIds.length > 0 && (
                <button
                  type='button'
                  onClick={() => setSelectedMitraIds([])}
                  className='text-[11px] text-rose-600 hover:underline'
                >
                  Hapus ({selectedMitraIds.length})
                </button>
              )}
            </div>
          </div>

          <select
            value=''
            onChange={(e) => handleAddMitra(e.target.value)}
            className='h-9 w-full rounded-md border border-sky-300 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-sky-800'
          >
            <option value=''>Pilih mitra (opsional)...</option>
            {masterMitra
              .filter((m) => !selectedMitraIds.includes(m.id))
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama}
                  {m.sobatId ? ` (${m.sobatId})` : ''}
                </option>
              ))}
          </select>

          {showAddMitra && (
            <div className='space-y-2 rounded-lg border border-sky-200 bg-sky-50/60 p-3 dark:border-sky-900 dark:bg-sky-950/30'>
              <p className='text-[11px] font-semibold text-sky-800 dark:text-sky-300'>
                Tambah Master Mitra Statistik Baru
              </p>
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
                <input
                  type='text'
                  value={newMitraNama}
                  onChange={(e) => setNewMitraNama(e.target.value)}
                  placeholder='Nama lengkap mitra *'
                  className='h-8 rounded border bg-background px-2.5 text-xs'
                />
                <input
                  type='text'
                  value={newMitraSobat}
                  onChange={(e) => setNewMitraSobat(e.target.value)}
                  placeholder='ID Sobat (opsional)'
                  className='h-8 rounded border bg-background px-2.5 text-xs'
                />
                <input
                  type='text'
                  value={newMitraHp}
                  onChange={(e) => setNewMitraHp(e.target.value)}
                  placeholder='No. HP (opsional)'
                  className='h-8 rounded border bg-background px-2.5 text-xs'
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  size='sm'
                  variant='ghost'
                  onClick={() => setShowAddMitra(false)}
                  className='h-7 text-xs'
                >
                  Batal
                </Button>
                <Button
                  type='button'
                  size='sm'
                  disabled={savingMitra}
                  onClick={() => void handleQuickCreateMitra()}
                  className='h-7 bg-sky-600 text-xs text-white hover:bg-sky-700'
                >
                  <Plus className='size-3' />
                  {savingMitra ? 'Menyimpan...' : 'Simpan & Pilih Mitra'}
                </Button>
              </div>
            </div>
          )}

          {selectedMitraList.length > 0 && (
            <div className='flex flex-wrap gap-1.5 pt-1'>
              {selectedMitraList.map((m) => (
                <span
                  key={m.id}
                  className='inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-800 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300'
                >
                  {m.nama}
                  <button
                    type='button'
                    onClick={() =>
                      setSelectedMitraIds((prev) =>
                        prev.filter((id) => id !== m.id),
                      )
                    }
                    className='rounded-full p-0.5 hover:bg-sky-200/70'
                  >
                    <X className='size-3' />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Baris 3: Nama Kegiatan & Nominal Pulsa */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <div className='space-y-1.5 md:col-span-8'>
          <label className='text-xs font-medium text-foreground'>
            Nama Kegiatan <span className='text-rose-600'>*</span>
          </label>
          <input
            type='text'
            list='daftar-kegiatan-pulsa'
            value={namaKegiatan}
            onChange={(e) => setNamaKegiatan(e.target.value)}
            placeholder='Contoh: Pendataan Podes, Pelatihan Susenas, atau lainnya'
            className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
          />
          <datalist id='daftar-kegiatan-pulsa'>
            {existingKegiatanNames.map((nama) => (
              <option key={nama} value={nama} />
            ))}
          </datalist>
          <p className='text-[11px] text-muted-foreground'>
            Tuliskan nama kegiatan pengumpulan data / survei / sensus
          </p>
        </div>

        <div className='space-y-1.5 md:col-span-4'>
          <label className='text-xs font-medium text-foreground'>
            Nominal Pulsa (Rp) <span className='text-rose-600'>*</span>
          </label>
          <input
            type='number'
            min={0}
            step={1000}
            value={nominal}
            onFocus={(e) => e.target.select()}
            onBlur={() => {
              if (nominal.trim() === '') setNominal('0')
            }}
            onChange={(e) => setNominal(e.target.value)}
            className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
          />
          <p className='text-[11px] font-medium text-emerald-700 dark:text-emerald-400'>
            {formatRupiah(nominalNumber)} / orang
          </p>
        </div>
      </div>

      {/* Baris 4: Keterangan */}
      <div className='space-y-1.5'>
        <label className='text-xs font-medium text-foreground'>
          Keterangan
        </label>
        <input
          type='text'
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder='Opsional: catatan tambahan'
          className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/30'
        />
      </div>

      {/* Ringkasan Data */}
      <div className='space-y-1 rounded-lg border bg-muted/50 p-4 text-xs'>
        <p className='font-semibold text-foreground'>Ringkasan Data:</p>
        <p className='text-muted-foreground'>
          Bulan:{' '}
          <span className='font-medium text-foreground'>
            {getNamaBulan(bulan)} {tahun}
          </span>
        </p>
        <p className='text-muted-foreground'>
          Kegiatan:{' '}
          <span className='font-medium text-foreground'>
            {namaKegiatan.trim() || '-'}
          </span>
        </p>
        <p className='text-muted-foreground'>
          Organik ({selectedPegawaiList.length}):{' '}
          <span className='font-medium text-foreground'>
            {selectedPegawaiList.length > 0
              ? selectedPegawaiList.map((p) => p.nama).join(', ')
              : '-'}
          </span>
        </p>
        <p className='text-muted-foreground'>
          Mitra ({selectedMitraList.length}):{' '}
          <span className='font-medium text-foreground'>
            {selectedMitraList.length > 0
              ? selectedMitraList.map((m) => m.nama).join(', ')
              : '-'}
          </span>
        </p>
        <p className='pt-1 text-sm font-semibold text-foreground'>
          Total Nominal: {formatRupiah(nominalNumber)} × {totalOrang} orang ={' '}
          <span className='text-emerald-700 dark:text-emerald-400'>
            {formatRupiah(totalNominal)}
          </span>
        </p>
      </div>

      {/* Tombol Submit & Reset */}
      <div className='flex flex-col gap-2.5 sm:flex-row'>
        <Button
          type='submit'
          disabled={submitting}
          className='flex-1 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
        >
          <Save className='size-4' />
          {submitting ? 'Menyimpan Ajuan...' : 'Simpan Ajuan Pulsa'}
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={handleResetForm}
          className='cursor-pointer'
        >
          <RotateCcw className='size-4' />
          Reset
        </Button>
      </div>
    </form>
  )
}
