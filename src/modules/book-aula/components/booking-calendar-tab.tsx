'use client'

import { useMemo, useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookingAulaItem } from '../types'

interface BookingCalendarTabProps {
  data: BookingAulaItem[]
  onDetail: (item: BookingAulaItem) => void
  onEdit: (item: BookingAulaItem) => void
}

const HARI_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTanggalLengkap(tanggalIso: string): string {
  const date = new Date(`${tanggalIso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return tanggalIso

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function BookingCalendarTab({
  data,
  onDetail,
  onEdit,
}: BookingCalendarTabProps) {
  const todayStr = useMemo(() => toDateKey(new Date()), [])
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, BookingAulaItem[]>()
    for (const item of data) {
      const existing = map.get(item.tanggal) ?? []
      existing.push(item)
      existing.sort((a, b) => a.jamMulai.localeCompare(b.jamMulai))
      map.set(item.tanggal, existing)
    }
    return map
  }, [data])

  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    // Konversi Minggu=0 menjadi Senin=0 ... Minggu=6
    const startWeekday = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7
    const cells: Array<{
      dateKey: string
      dayNumber: number
      isCurrentMonth: boolean
    }> = []

    for (let i = 0; i < totalCells; i++) {
      const cellDate = new Date(year, month, 1 - startWeekday + i)
      cells.push({
        dateKey: toDateKey(cellDate),
        dayNumber: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === month,
      })
    }

    return cells
  }, [currentMonth])

  const monthTitle = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      year: 'numeric',
    }).format(currentMonth)
  }, [currentMonth])

  const selectedBookings = bookingsByDate.get(selectedDate) ?? []

  function handlePrevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    )
  }

  function handleNextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    )
  }

  function handleSelectCell(dateKey: string, isCurrentMonth: boolean) {
    setSelectedDate(dateKey)
    if (!isCurrentMonth) {
      const [y, m] = dateKey.split('-').map(Number)
      setCurrentMonth(new Date(y, m - 1, 1))
    }
  }

  return (
    <div className='space-y-5 rounded-xl border bg-card p-6 shadow-sm'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>
            Kalender Ruang
          </h2>
          <p className='text-xs text-muted-foreground'>
            Pilih tanggal untuk melihat jadwal pemesanan.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={handlePrevMonth}
            title='Bulan Sebelumnya'
          >
            <ChevronLeft className='size-4' />
          </Button>
          <span className='min-w-32 text-center text-sm font-medium capitalize text-foreground'>
            {monthTitle}
          </span>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-8 cursor-pointer'
            onClick={handleNextMonth}
            title='Bulan Berikutnya'
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </div>

      {/* Grid Kalender Bulanan */}
      <div className='overflow-x-auto'>
        <div className='min-w-[600px]'>
          <div className='grid grid-cols-7 border-b pb-2 text-center text-xs font-medium text-muted-foreground'>
            {HARI_LABELS.map((hari) => (
              <div key={hari}>{hari}</div>
            ))}
          </div>

          <div className='mt-2 grid grid-cols-7 gap-1.5'>
            {calendarCells.map((cell) => {
              const items = bookingsByDate.get(cell.dateKey) ?? []
              const hasBooking = items.length > 0
              const isSelected = cell.dateKey === selectedDate

              return (
                <button
                  key={cell.dateKey}
                  type='button'
                  onClick={() =>
                    handleSelectCell(cell.dateKey, cell.isCurrentMonth)
                  }
                  className={`flex min-h-20 cursor-pointer flex-col items-start justify-between rounded-lg border p-2 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30'
                      : 'border-border/70 bg-background hover:bg-muted/40'
                  } ${!cell.isCurrentMonth ? 'opacity-45' : ''}`}
                >
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                      hasBooking
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                          ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                          : 'text-foreground'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {hasBooking && (
                    <span className='text-[11px] font-medium text-emerald-700 dark:text-emerald-400'>
                      {items.length} jadwal
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail Jadwal pada Tanggal Terpilih */}
      <div className='space-y-3 border-t pt-4'>
        <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
          <CalendarIcon className='size-4 text-muted-foreground' />
          <span className='capitalize'>
            {formatTanggalLengkap(selectedDate)}
          </span>
        </div>

        {selectedBookings.length === 0 ? (
          <div className='rounded-lg border border-dashed px-4 py-5 text-center text-xs text-muted-foreground'>
            Tidak ada pemesanan ruang pada tanggal ini.
          </div>
        ) : (
          <div className='space-y-2.5'>
            {selectedBookings.map((item) => (
              <div
                key={item.id}
                className='flex flex-col justify-between gap-3 rounded-lg border bg-muted/20 p-3.5 sm:flex-row sm:items-center'
              >
                <div className='space-y-0.5 text-xs'>
                  <div className='font-semibold text-foreground'>
                    {item.jamMulai}–{item.jamSelesai} &middot; {item.namaRuang}
                  </div>
                  <div className='text-muted-foreground'>
                    {item.namaPeminjam} &middot; {item.jumlahPeserta} peserta
                  </div>
                  <div className='pt-0.5 text-foreground'>{item.kegiatan}</div>
                </div>

                <div className='flex items-center gap-1 self-end sm:self-center'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-7 cursor-pointer'
                    title='Detail'
                    onClick={() => onDetail(item)}
                  >
                    <Eye className='size-3.5' />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-7 cursor-pointer text-amber-600 hover:text-amber-700'
                    title='Edit'
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className='size-3.5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
