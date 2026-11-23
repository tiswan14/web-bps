import { prisma } from '@/lib/prisma'
import { DAFTAR_RUANG_AULA, toMinutes } from '../data/mock-book-aula'
import type {
  BookAulaQueryInput,
  CreateBookAulaSchemaInput,
  UpdateBookAulaSchemaInput,
} from '../validations/book-aula.schema'

const bookingSelect = {
  id: true,
  ruangId: true,
  namaRuang: true,
  tanggal: true,
  jamMulai: true,
  jamSelesai: true,
  namaPeminjam: true,
  jumlahPeserta: true,
  kegiatan: true,
  dicatatOleh: true,
  createdAt: true,
  updatedAt: true,
  pencatat: {
    select: {
      id: true,
      username: true,
      email: true,
    },
  },
}

export class BookAulaDomainError extends Error {
  constructor(
    public code:
      | 'BOOKING_NOT_FOUND'
      | 'RUANG_NOT_FOUND'
      | 'INVALID_TIME_RANGE'
      | 'CAPACITY_EXCEEDED'
      | 'SCHEDULE_CONFLICT',
    message: string,
  ) {
    super(message)
    this.name = 'BookAulaDomainError'
  }
}

async function validateJadwalDanKapasitas(
  params: {
    ruangId: string
    tanggal: string
    jamMulai: string
    jamSelesai: string
    jumlahPeserta: number
  },
  excludeId?: string,
) {
  const room = DAFTAR_RUANG_AULA.find((r) => r.id === params.ruangId)
  if (!room) {
    throw new BookAulaDomainError(
      'RUANG_NOT_FOUND',
      'Ruang rapat yang dipilih tidak ditemukan',
    )
  }

  const startNew = toMinutes(params.jamMulai)
  const endNew = toMinutes(params.jamSelesai)
  if (endNew <= startNew) {
    throw new BookAulaDomainError(
      'INVALID_TIME_RANGE',
      'Jam selesai harus lebih akhir daripada jam mulai',
    )
  }

  if (params.jumlahPeserta < 1 || params.jumlahPeserta > room.kapasitas) {
    throw new BookAulaDomainError(
      'CAPACITY_EXCEEDED',
      `Jumlah peserta untuk ${room.nama} maksimal ${room.kapasitas} orang`,
    )
  }

  const sameDayBookings = await prisma.bookingAula.findMany({
    where: {
      ruangId: params.ruangId,
      tanggal: new Date(`${params.tanggal}T00:00:00.000Z`),
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: {
      id: true,
      jamMulai: true,
      jamSelesai: true,
      kegiatan: true,
      namaPeminjam: true,
    },
  })

  const conflict = sameDayBookings.find((item) => {
    const startExisting = toMinutes(item.jamMulai)
    const endExisting = toMinutes(item.jamSelesai)
    return startNew < endExisting && endNew > startExisting
  })

  if (conflict) {
    throw new BookAulaDomainError(
      'SCHEDULE_CONFLICT',
      `Jadwal bentrok dengan kegiatan "${conflict.kegiatan}" (${conflict.jamMulai}–${conflict.jamSelesai}) oleh ${conflict.namaPeminjam}`,
    )
  }

  return room
}

export async function getBookingAulaList(params: BookAulaQueryInput) {
  const { page, limit, search, ruangId, tanggal } = params

  const where = {
    ...(ruangId && { ruangId }),
    ...(tanggal && { tanggal: new Date(`${tanggal}T00:00:00.000Z`) }),
    ...(search && {
      OR: [
        { kegiatan: { contains: search, mode: 'insensitive' as const } },
        { namaPeminjam: { contains: search, mode: 'insensitive' as const } },
        { namaRuang: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [data, total] = await prisma.$transaction([
    prisma.bookingAula.findMany({
      where,
      select: bookingSelect,
      orderBy: [
        { tanggal: 'desc' },
        { jamMulai: 'asc' },
        { updatedAt: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.bookingAula.count({ where }),
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

export async function getBookingAulaById(id: string) {
  return prisma.bookingAula.findUnique({
    where: { id },
    select: bookingSelect,
  })
}

export async function createBookingAula(
  input: CreateBookAulaSchemaInput,
  userId: string,
) {
  const room = await validateJadwalDanKapasitas(input)

  return prisma.bookingAula.create({
    data: {
      ruangId: room.id,
      namaRuang: room.nama,
      tanggal: new Date(`${input.tanggal}T00:00:00.000Z`),
      jamMulai: input.jamMulai,
      jamSelesai: input.jamSelesai,
      namaPeminjam: input.namaPeminjam,
      jumlahPeserta: input.jumlahPeserta,
      kegiatan: input.kegiatan,
      dicatatOleh: userId,
    },
    select: bookingSelect,
  })
}

export async function updateBookingAula(
  id: string,
  input: UpdateBookAulaSchemaInput,
) {
  const existing = await prisma.bookingAula.findUnique({
    where: { id },
  })

  if (!existing) {
    throw new BookAulaDomainError(
      'BOOKING_NOT_FOUND',
      'Pemesanan ruang tidak ditemukan',
    )
  }

  const merged = {
    ruangId: input.ruangId ?? existing.ruangId,
    tanggal: input.tanggal ?? existing.tanggal.toISOString().slice(0, 10),
    jamMulai: input.jamMulai ?? existing.jamMulai,
    jamSelesai: input.jamSelesai ?? existing.jamSelesai,
    jumlahPeserta: input.jumlahPeserta ?? existing.jumlahPeserta,
  }

  const room = await validateJadwalDanKapasitas(merged, id)

  return prisma.bookingAula.update({
    where: { id },
    data: {
      ruangId: room.id,
      namaRuang: room.nama,
      tanggal: new Date(`${merged.tanggal}T00:00:00.000Z`),
      jamMulai: merged.jamMulai,
      jamSelesai: merged.jamSelesai,
      ...(input.namaPeminjam !== undefined && {
        namaPeminjam: input.namaPeminjam,
      }),
      jumlahPeserta: merged.jumlahPeserta,
      ...(input.kegiatan !== undefined && { kegiatan: input.kegiatan }),
    },
    select: bookingSelect,
  })
}

export async function deleteBookingAula(id: string) {
  return prisma.bookingAula.delete({
    where: { id },
    select: { id: true },
  })
}
