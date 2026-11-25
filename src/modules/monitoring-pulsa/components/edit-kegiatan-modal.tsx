'use client'

import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type {
  MasterMitraOption,
  MasterPegawaiOption,
  PulsaKegiatanItem,
  UpdateKegiatanPulsaInput,
} from '../types'
import { formatRupiah } from '../utils/format'

interface EditKegiatanModalProps {
  kegiatan: PulsaKegiatanItem | null
  masterPegawai: MasterPegawaiOption[]
  masterMitra: MasterMitraOption[]
  onClose: () => void
  onSave: (kegiatanId: string, input: UpdateKegiatanPulsaInput) => Promise<void>
}

export function EditKegiatanModal({
  kegiatan,
  masterPegawai,
  masterMitra,
  onClose,
  onSave,
}: EditKegiatanModalProps) {
  const [namaKegiatan, setNamaKegiatan] = useState('')
  const [nominal, setNominal] = useState('50000')
  const [keterangan, setKeterangan] = useState('')
  const [pegawaiIds, setPegawaiIds] = useState<string[]>([])
  const [mitraIds, setMitraIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!kegiatan) return
    setNamaKegiatan(kegiatan.namaKegiatan)
    setNominal(String(kegiatan.nominalPerOrang))
    setKeterangan(kegiatan.keterangan ?? '')
    setPegawaiIds(
      kegiatan.alokasi
        .filter((a) => a.tipePetugas === 'ORGANIK')
        .map((a) => a.petugasId),
    )
    setMitraIds(
      kegiatan.alokasi
        .filter((a) => a.tipePetugas === 'MITRA')
        .map((a) => a.petugasId),
    )
  }, [kegiatan])

  if (!kegiatan) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!kegiatan) return
    const nominalNum = Math.max(0, Number(nominal) || 0)
    if (!namaKegiatan.trim() || nominalNum < 1000) {
      toast.error('Periksa kembali nama kegiatan dan nominal pulsa.')
      return
    }
    if (pegawaiIds.length + mitraIds.length === 0) {
      toast.error('Minimal harus terdapat 1 petugas.')
      return
    }

    try {
      setSaving(true)
      await onSave(kegiatan.id, {
        namaKegiatan: namaKegiatan.trim(),
        nominalPerOrang: nominalNum,
        keterangan: keterangan.trim() || undefined,
        pegawaiIds,
        mitraIds,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card p-6 shadow-xl'>
        <div className='flex items-center justify-between border-b pb-3'>
          <h3 className='text-base font-semibold text-foreground'>
            Edit Kegiatan & Daftar Petugas
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='rounded p-1 text-muted-foreground hover:bg-muted'
          >
            <X className='size-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium'>Nama Kegiatan</label>
            <input
              type='text'
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              className='h-9 w-full rounded-md border bg-background px-3 text-sm'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium'>Nominal per Orang (Rp)</label>
              <input
                type='number'
                min={1000}
                step={1000}
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm'
              />
              <p className='text-[11px] text-emerald-600'>
                {formatRupiah(Number(nominal) || 0)}
              </p>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium'>Keterangan</label>
              <input
                type='text'
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium'>Tambah Organik</label>
              <select
                value=''
                onChange={(e) => {
                  const id = e.target.value
                  if (id && !pegawaiIds.includes(id)) {
                    setPegawaiIds((prev) => [...prev, id])
                  }
                }}
                className='h-9 w-full rounded-md border bg-background px-3 text-xs'
              >
                <option value=''>+ Tambah pegawai organik...</option>
                {masterPegawai
                  .filter((p) => !pegawaiIds.includes(p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
              </select>
              <div className='flex flex-wrap gap-1 pt-1'>
                {pegawaiIds.map((id) => {
                  const p = masterPegawai.find((x) => x.id === id)
                  return (
                    <span
                      key={id}
                      className='inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-800'
                    >
                      {p?.nama ?? id}
                      <button
                        type='button'
                        onClick={() =>
                          setPegawaiIds((prev) => prev.filter((x) => x !== id))
                        }
                      >
                        <X className='size-3' />
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium'>Tambah Mitra</label>
              <select
                value=''
                onChange={(e) => {
                  const id = e.target.value
                  if (id && !mitraIds.includes(id)) {
                    setMitraIds((prev) => [...prev, id])
                  }
                }}
                className='h-9 w-full rounded-md border bg-background px-3 text-xs'
              >
                <option value=''>+ Tambah mitra statistik...</option>
                {masterMitra
                  .filter((m) => !mitraIds.includes(m.id))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama}
                    </option>
                  ))}
              </select>
              <div className='flex flex-wrap gap-1 pt-1'>
                {mitraIds.map((id) => {
                  const m = masterMitra.find((x) => x.id === id)
                  return (
                    <span
                      key={id}
                      className='inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800'
                    >
                      {m?.nama ?? id}
                      <button
                        type='button'
                        onClick={() =>
                          setMitraIds((prev) => prev.filter((x) => x !== id))
                        }
                      >
                        <X className='size-3' />
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button type='button' variant='outline' onClick={onClose}>
              Batal
            </Button>
            <Button
              type='submit'
              disabled={saving}
              className='bg-emerald-600 text-white hover:bg-emerald-700'
            >
              <Save className='size-4' />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
