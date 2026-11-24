import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreatePengadaanSchemaInput,
  PengadaanQueryInput,
  UpdatePengadaanSchemaInput,
} from '../validations/pengadaan.schema'

const pengadaanSelect = {
  id: true,
  kodePengadaan: true,
  tahunAnggaran: true,
  tanggalUsulan: true,
  jenisPengadaan: true,
  namaProduk: true,
  detilPok: true,
  kodePok: true,
  status: true,
  rencana: true,
  realisasi: true,
  formPermintaan: true,
  linkKak: true,
  jenisDokumen: true,
  nomorDokumen: true,
  tanggalDokumen: true,
  namaPenyedia: true,
  tanggalPembayaran: true,
  nomorBuktiPembayaran: true,
  linkEpurchasing: true,
  keterangan: true,
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

function generateKodePengadaan(tahun: number): string {
  const part1 = Date.now().toString(36).slice(-8)
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PGD-${tahun}-${part1}-${part2}`
}

function toUtcDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`)
}

export async function getPengadaanList(params: PengadaanQueryInput) {
  const { page, limit, search, bulan, tahun, status } = params

  const where: Prisma.PengadaanWhereInput = {
    ...(tahun && { tahunAnggaran: tahun }),
    ...(status && { status }),
  }

  if (bulan && bulan !== 'ALL') {
    const targetYear = tahun ?? new Date().getFullYear()
    const monthNum = Number(bulan)
    if (monthNum >= 1 && monthNum <= 12) {
      const startDate = new Date(Date.UTC(targetYear, monthNum - 1, 1))
      const endDate = new Date(Date.UTC(targetYear, monthNum, 1))
      where.tanggalUsulan = {
        gte: startDate,
        lt: endDate,
      }
    }
  }

  if (search) {
    where.OR = [
      { kodePengadaan: { contains: search, mode: 'insensitive' } },
      { namaProduk: { contains: search, mode: 'insensitive' } },
      { detilPok: { contains: search, mode: 'insensitive' } },
      { kodePok: { contains: search, mode: 'insensitive' } },
      { namaPenyedia: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [data, total, aggregate] = await prisma.$transaction([
    prisma.pengadaan.findMany({
      where,
      select: pengadaanSelect,
      orderBy: [{ tanggalUsulan: 'asc' }, { createdAt: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pengadaan.count({ where }),
    prisma.pengadaan.aggregate({
      where,
      _sum: {
        rencana: true,
        realisasi: true,
      },
    }),
  ])

  return {
    data,
    summary: {
      totalRencana: aggregate._sum.rencana ?? 0,
      totalRealisasi: aggregate._sum.realisasi ?? 0,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

export async function getPengadaanById(id: string) {
  return prisma.pengadaan.findUnique({
    where: { id },
    select: pengadaanSelect,
  })
}

export async function createPengadaan(
  input: CreatePengadaanSchemaInput,
  userId: string,
) {
  const tahunAnggaran = Number(input.tanggalUsulan.slice(0, 4))

  return prisma.pengadaan.create({
    data: {
      kodePengadaan: generateKodePengadaan(tahunAnggaran),
      tahunAnggaran,
      tanggalUsulan: toUtcDate(input.tanggalUsulan),
      jenisPengadaan: input.jenisPengadaan,
      namaProduk: input.namaProduk,
      detilPok: input.detilPok,
      kodePok: input.kodePok,
      status: input.status,
      rencana: input.rencana,
      realisasi: input.realisasi ?? 0,
      formPermintaan: input.formPermintaan ?? null,
      linkKak: input.linkKak ?? null,
      jenisDokumen: input.jenisDokumen ?? null,
      nomorDokumen: input.nomorDokumen ?? null,
      tanggalDokumen: input.tanggalDokumen
        ? toUtcDate(input.tanggalDokumen)
        : null,
      namaPenyedia: input.namaPenyedia ?? null,
      tanggalPembayaran: input.tanggalPembayaran
        ? toUtcDate(input.tanggalPembayaran)
        : null,
      nomorBuktiPembayaran: input.nomorBuktiPembayaran ?? null,
      linkEpurchasing: input.linkEpurchasing ?? null,
      keterangan: input.keterangan ?? null,
      dicatatOleh: userId,
    },
    select: pengadaanSelect,
  })
}

export async function updatePengadaan(
  id: string,
  input: UpdatePengadaanSchemaInput,
) {
  const data: Prisma.PengadaanUpdateInput = {
    ...(input.tanggalUsulan !== undefined && {
      tanggalUsulan: toUtcDate(input.tanggalUsulan),
      tahunAnggaran: Number(input.tanggalUsulan.slice(0, 4)),
    }),
    ...(input.jenisPengadaan !== undefined && {
      jenisPengadaan: input.jenisPengadaan,
    }),
    ...(input.namaProduk !== undefined && { namaProduk: input.namaProduk }),
    ...(input.detilPok !== undefined && { detilPok: input.detilPok }),
    ...(input.kodePok !== undefined && { kodePok: input.kodePok }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.rencana !== undefined && { rencana: input.rencana }),
    ...(input.realisasi !== undefined && { realisasi: input.realisasi }),
    ...(input.formPermintaan !== undefined && {
      formPermintaan: input.formPermintaan,
    }),
    ...(input.linkKak !== undefined && { linkKak: input.linkKak }),
    ...(input.jenisDokumen !== undefined && {
      jenisDokumen: input.jenisDokumen,
    }),
    ...(input.nomorDokumen !== undefined && {
      nomorDokumen: input.nomorDokumen,
    }),
    ...(input.tanggalDokumen !== undefined && {
      tanggalDokumen: input.tanggalDokumen
        ? toUtcDate(input.tanggalDokumen)
        : null,
    }),
    ...(input.namaPenyedia !== undefined && {
      namaPenyedia: input.namaPenyedia,
    }),
    ...(input.tanggalPembayaran !== undefined && {
      tanggalPembayaran: input.tanggalPembayaran
        ? toUtcDate(input.tanggalPembayaran)
        : null,
    }),
    ...(input.nomorBuktiPembayaran !== undefined && {
      nomorBuktiPembayaran: input.nomorBuktiPembayaran,
    }),
    ...(input.linkEpurchasing !== undefined && {
      linkEpurchasing: input.linkEpurchasing,
    }),
    ...(input.keterangan !== undefined && { keterangan: input.keterangan }),
  }

  return prisma.pengadaan.update({
    where: { id },
    data,
    select: pengadaanSelect,
  })
}

export async function deletePengadaan(id: string) {
  return prisma.pengadaan.delete({
    where: { id },
    select: { id: true },
  })
}
