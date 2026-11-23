'use client'

import { useCallback, useEffect, useState } from 'react'
import { Building2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/page-container'

import { BookingListTab } from '@/modules/book-aula/components/booking-list-tab'
import { BookingCalendarTab } from '@/modules/book-aula/components/booking-calendar-tab'
import {
  DetailBookingModal,
  FormBookingModal,
  HapusBookingModal,
} from '@/modules/book-aula/components/booking-modals'
import { DAFTAR_RUANG_AULA } from '@/modules/book-aula/data/mock-book-aula'
import {
  deleteBookAulaById,
  fetchBookAulaList,
  patchUpdateBookAula,
  postCreateBookAula,
} from '@/modules/book-aula/services/book-aula-api.service'
import type {
  BookingAulaItem,
  CreateBookingAulaInput,
} from '@/modules/book-aula/types'

type TabBookAula = 'daftar' | 'kalender'

export default function BookAulaPage() {
  const [activeTab, setActiveTab] = useState<TabBookAula>('daftar')
  const [bookings, setBookings] = useState<BookingAulaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [openFormModal, setOpenFormModal] = useState(false)
  const [editingBooking, setEditingBooking] =
    useState<BookingAulaItem | null>(null)
  const [detailBooking, setDetailBooking] = useState<BookingAulaItem | null>(
    null,
  )
  const [deletingBooking, setDeletingBooking] =
    useState<BookingAulaItem | null>(null)

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      setErrorMsg(null)
      const items = await fetchBookAulaList()
      setBookings(items)
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Gagal memuat jadwal pemesanan ruang',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadBookings()
  }, [loadBookings])

  async function handleSimpanBooking(
    input: CreateBookingAulaInput,
    editId?: string,
  ) {
    if (editId) {
      await patchUpdateBookAula(editId, input)
    } else {
      await postCreateBookAula(input)
    }
    await loadBookings()
  }

  async function handleHapusBooking(id: string) {
    await deleteBookAulaById(id)
    await loadBookings()
  }

  return (
    <PageContainer>
      {/* Header Judul & Tombol Buat Pemesanan */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2.5'>
            <Building2 className='size-6 text-foreground' />
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>
              Book Aula
            </h1>
          </div>
          <p className='text-sm text-muted-foreground'>
            Lihat ketersediaan dan pesan ruang rapat satker Anda.
          </p>
        </div>

        <Button
          type='button'
          onClick={() => {
            setEditingBooking(null)
            setOpenFormModal(true)
          }}
          className='cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700'
        >
          <Plus className='size-4' />
          Buat Pemesanan
        </Button>
      </div>

      {/* Kartu Ringkasan Ruangan & Kapasitas */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {DAFTAR_RUANG_AULA.map((room) => (
          <div
            key={room.id}
            className='flex items-center justify-between rounded-xl border bg-card px-5 py-4 shadow-sm'
          >
            <div>
              <h2 className='text-sm font-semibold text-foreground'>
                {room.nama}
              </h2>
              {room.keterangan && (
                <p className='mt-0.5 text-xs text-muted-foreground'>
                  {room.keterangan}
                </p>
              )}
            </div>

            <span className='shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'>
              Maks. {room.kapasitas} orang
            </span>
          </div>
        ))}
      </div>

      {/* Switcher Tab Daftar & Kalender */}
      <div className='flex'>
        <div className='inline-flex rounded-lg bg-muted p-1'>
          <button
            type='button'
            onClick={() => setActiveTab('daftar')}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'daftar'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daftar
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('kalender')}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'kalender'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Kalender
          </button>
        </div>
      </div>

      {/* Konten Tab Aktif */}
      {errorMsg ? (
        <div className='flex flex-col items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive'>
          <p>{errorMsg}</p>
          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={() => void loadBookings()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : loading ? (
        <div className='rounded-xl border bg-card py-12 text-center text-sm text-muted-foreground'>
          Memuat jadwal pemesanan ruang...
        </div>
      ) : activeTab === 'daftar' ? (
        <BookingListTab
          data={bookings}
          onDetail={(item) => setDetailBooking(item)}
          onEdit={(item) => {
            setEditingBooking(item)
            setOpenFormModal(true)
          }}
          onDelete={(item) => setDeletingBooking(item)}
        />
      ) : (
        <BookingCalendarTab
          data={bookings}
          onDetail={(item) => setDetailBooking(item)}
          onEdit={(item) => {
            setEditingBooking(item)
            setOpenFormModal(true)
          }}
        />
      )}

      {/* Modal Form, Detail & Hapus */}
      <FormBookingModal
        open={openFormModal}
        existingBookings={bookings}
        initialData={editingBooking}
        onClose={() => {
          setOpenFormModal(false)
          setEditingBooking(null)
        }}
        onSubmit={handleSimpanBooking}
      />

      <DetailBookingModal
        booking={detailBooking}
        onClose={() => setDetailBooking(null)}
        onEdit={(item) => {
          setEditingBooking(item)
          setOpenFormModal(true)
        }}
      />

      <HapusBookingModal
        booking={deletingBooking}
        onClose={() => setDeletingBooking(null)}
        onConfirm={handleHapusBooking}
      />
    </PageContainer>
  )
}
