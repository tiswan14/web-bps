'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  cekBentrokJadwal,
  DAFTAR_RUANG_AULA,
  toMinutes,
} from '../data/mock-book-aula'
import type {
  BookingAulaItem,
  CreateBookingAulaInput,
  RuangAula,
} from '../types'

interface FormBookingModalProps {
  open: boolean
  rooms?: RuangAula[]
  existingBookings: BookingAulaItem[]
  initialData?: BookingAulaItem | null
  onClose: () => void
  onSubmit: (data: CreateBookingAulaInput, editId?: string) => Promise<void>
}

export function FormBookingModal({
  open,
  rooms = DAFTAR_RUANG_AULA,
  existingBookings,
  initialData = null,
  onClose,
  onSubmit,
}: FormBookingModalProps) {
  const isEdit = Boolean(initialData)

  const [ruangId, setRuangId] = useState(rooms[0]?.id ?? 'aula-sinergi')
  const [tanggal, setTanggal] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [jamMulai, setJamMulai] = useState('08:00')
  const [jamSelesai, setJamSelesai] = useState('12:00')
  const [namaPeminjam, setNamaPeminjam] = useState('')
  const [jumlahPeserta, setJumlahPeserta] = useState('10')
  const [kegiatan, setKegiatan] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setErrorMsg(null)

    if (initialData) {
      setRuangId(initialData.ruangId)
      setTanggal(initialData.tanggal)
      setJamMulai(initialData.jamMulai)
      setJamSelesai(initialData.jamSelesai)
      setNamaPeminjam(initialData.namaPeminjam)
      setJumlahPeserta(String(initialData.jumlahPeserta))
      setKegiatan(initialData.kegiatan)
    } else {
      setRuangId(rooms[0]?.id ?? 'aula-sinergi')
      setTanggal(new Date().toISOString().slice(0, 10))
      setJamMulai('08:00')
      setJamSelesai('12:00')
      setNamaPeminjam('')
      setJumlahPeserta('10')
      setKegiatan('')
    }
  }, [open, initialData, rooms])

  if (!open) return null

  const selectedRoom = rooms.find((r) => r.id === ruangId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    const pesertaNum = Number(jumlahPeserta)

    if (toMinutes(jamSelesai) <= toMinutes(jamMulai)) {
      setErrorMsg('Jam selesai harus lebih akhir daripada jam mulai.')
      return
    }

    if (
      selectedRoom &&
      (Number.isNaN(pesertaNum) ||
        pesertaNum < 1 ||
        pesertaNum > selectedRoom.kapasitas)
    ) {
      setErrorMsg(
        `Jumlah peserta untuk ${selectedRoom.nama} harus antara 1 sampai ${selectedRoom.kapasitas} orang.`,
      )
      return
    }

    const bentrok = cekBentrokJadwal(
      existingBookings,
      { ruangId, tanggal, jamMulai, jamSelesai },
      initialData?.id,
    )

    if (bentrok) {
      setErrorMsg(
        `Jadwal bentrok dengan kegiatan "${bentrok.kegiatan}" (${bentrok.jamMulai}–${bentrok.jamSelesai}) oleh ${bentrok.namaPeminjam}.`,
      )
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(
        {
          ruangId,
          tanggal,
          jamMulai,
          jamSelesai,
          namaPeminjam: namaPeminjam.trim(),
          jumlahPeserta: pesertaNum,
          kegiatan: kegiatan.trim(),
        },
        initialData?.id,
      )
      onClose()
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal menyimpan pemesanan ruang',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between border-b pb-3'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>
              {isEdit ? 'Edit Pemesanan Ruang' : 'Buat Pemesanan Ruang'}
            </h2>
            <p className='text-xs text-muted-foreground'>
              Pastikan jadwal dan jumlah peserta sesuai kapasitas ruangan.
            </p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7'
            disabled={submitting}
            onClick={onClose}
          >
            <X className='size-4' />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-3.5 text-sm'>
          {errorMsg && (
            <div className='rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive'>
              {errorMsg}
            </div>
          )}

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Ruang Rapat
              </label>
              <select
                required
                value={ruangId}
                onChange={(e) => setRuangId(e.target.value)}
                className='h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nama} (Maks. {room.kapasitas} org)
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Tanggal Pemesanan
              </label>
              <Input
                type='date'
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Jam Mulai
              </label>
              <Input
                type='time'
                required
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Jam Selesai
              </label>
              <Input
                type='time'
                required
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>
                Jumlah Peserta
              </label>
              <Input
                type='number'
                min={1}
                max={selectedRoom?.kapasitas ?? 100}
                required
                value={jumlahPeserta}
                onChange={(e) => setJumlahPeserta(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Nama Peminjam / Penanggung Jawab
            </label>
            <Input
              required
              placeholder='Contoh: Hafizh Meyzar Aqil, SST, M.Sc.'
              value={namaPeminjam}
              onChange={(e) => setNamaPeminjam(e.target.value)}
            />
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>
              Nama Kegiatan
            </label>
            <textarea
              required
              rows={2}
              placeholder='Contoh: Pelatihan Petugas Pengolahan SPKRT 2027'
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              className='w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
            />
          </div>

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button
              type='button'
              variant='outline'
              disabled={submitting}
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type='submit'
              disabled={submitting}
              className='bg-emerald-600 text-white hover:bg-emerald-700'
            >
              {submitting
                ? 'Menyimpan...'
                : isEdit
                  ? 'Simpan Perubahan'
                  : 'Simpan Pemesanan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface DetailBookingModalProps {
  booking: BookingAulaItem | null
  onClose: () => void
  onEdit: (item: BookingAulaItem) => void
}

export function DetailBookingModal({
  booking,
  onClose,
  onEdit,
}: DetailBookingModalProps) {
  if (!booking) return null

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${booking.tanggal}T00:00:00`))

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-xl border bg-background p-6 shadow-lg'>
        <div className='mb-4 flex items-center justify-between border-b pb-3'>
          <div>
            <h2 className='text-base font-semibold text-foreground'>
              Detail Pemesanan Ruang
            </h2>
            <p className='text-xs text-muted-foreground'>{booking.namaRuang}</p>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7'
            onClick={onClose}
          >
            <X className='size-4' />
          </Button>
        </div>

        <dl className='grid grid-cols-1 gap-3 text-sm sm:grid-cols-2'>
          <div>
            <dt className='text-xs text-muted-foreground'>Ruang Rapat</dt>
            <dd className='font-medium text-foreground'>{booking.namaRuang}</dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Jumlah Peserta</dt>
            <dd className='font-medium text-foreground'>
              {booking.jumlahPeserta} orang
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Tanggal</dt>
            <dd className='font-medium capitalize text-foreground'>
              {formattedDate}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>Waktu</dt>
            <dd className='font-medium text-foreground'>
              {booking.jamMulai}–{booking.jamSelesai} WIB
            </dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>Nama Peminjam</dt>
            <dd className='font-medium text-foreground'>
              {booking.namaPeminjam}
            </dd>
          </div>
          <div className='sm:col-span-2'>
            <dt className='text-xs text-muted-foreground'>Kegiatan</dt>
            <dd className='rounded-md bg-muted/50 p-2.5 font-medium text-foreground'>
              {booking.kegiatan}
            </dd>
          </div>
        </dl>

        <div className='mt-6 flex justify-end gap-2 border-t pt-4'>
          <Button type='button' variant='outline' onClick={onClose}>
            Tutup
          </Button>
          <Button
            type='button'
            className='bg-emerald-600 text-white hover:bg-emerald-700'
            onClick={() => {
              onClose()
              onEdit(booking)
            }}
          >
            Edit Pemesanan
          </Button>
        </div>
      </div>
    </div>
  )
}

interface HapusBookingModalProps {
  booking: BookingAulaItem | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function HapusBookingModal({
  booking,
  onClose,
  onConfirm,
}: HapusBookingModalProps) {
  const [deleting, setDeleting] = useState(false)

  if (!booking) return null

  async function handleDelete() {
    if (!booking) return
    try {
      setDeleting(true)
      await onConfirm(booking.id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-xl border bg-background p-6 shadow-lg'>
        <div className='flex items-start gap-3'>
          <div className='rounded-full bg-destructive/10 p-2 text-destructive'>
            <AlertTriangle className='size-5' />
          </div>
          <div className='space-y-1'>
            <h2 className='text-base font-semibold text-foreground'>
              Batalkan Pemesanan Ruang?
            </h2>
            <p className='text-xs text-muted-foreground'>
              Jadwal{' '}
              <span className='font-semibold text-foreground'>
                {booking.kegiatan}
              </span>{' '}
              di{' '}
              <span className='font-semibold text-foreground'>
                {booking.namaRuang}
              </span>{' '}
              ({booking.jamMulai}–{booking.jamSelesai}) akan dihapus.
            </p>
          </div>
        </div>

        <div className='mt-5 flex justify-end gap-2 border-t pt-4'>
          <Button
            type='button'
            variant='outline'
            disabled={deleting}
            onClick={onClose}
          >
            Kembali
          </Button>
          <Button
            type='button'
            variant='destructive'
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            {deleting ? 'Menghapus...' : 'Ya, Batalkan'}
          </Button>
        </div>
      </div>
    </div>
  )
}
