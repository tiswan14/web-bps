import { prisma } from '@/lib/prisma'
import { ApiError } from '@/lib/api'
import type { Role } from '@/generated/prisma/client'
import type {
  CreateAjuanPulsaInput,
  MonitoringPulsaResponse,
  PulsaAlokasiDetail,
  PulsaKegiatanItem,
  PulsaPetugasRow,
  StatusPersetujuanPulsa,
  UpdateKegiatanPulsaInput,
} from '../types'
import { getNamaBulan, terbilangRupiah } from '../utils/format'

const ROLES_CAN_MANAGE = new Set<Role>(['ADMIN', 'OPERATOR', 'PPK', 'BENDAHARA'])
const ROLES_CAN_APPROVE = new Set<Role>(['ADMIN', 'PPK'])

export async function getMonitoringPulsaData(params: {
  bulan: number
  tahun: number
  userRole: Role
}): Promise<MonitoringPulsaResponse> {
  const { bulan, tahun, userRole } = params

  const [kegiatanDb, masterPegawai, masterMitra] = await Promise.all([
    prisma.monitoringPulsaKegiatan.findMany({
      where: { bulan, tahun },
      orderBy: { createdAt: 'asc' },
      include: {
        alokasi: {
          include: {
            pegawai: { select: { id: true, nama: true } },
            mitra: { select: { id: true, nama: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.pegawai.findMany({
      where: { aktif: true },
      orderBy: { nama: 'asc' },
      select: { id: true, nama: true, nip: true, jabatan: true },
    }),
    prisma.mitraStatistik.findMany({
      where: { aktif: true },
      orderBy: { nama: 'asc' },
      select: {
        id: true,
        nama: true,
        sobatId: true,
        noHp: true,
        kecamatan: true,
      },
    }),
  ])

  const petugasMap = new Map<
    string,
    {
      key: string
      petugasId: string
      nama: string
      tipe: 'ORGANIK' | 'MITRA'
      kegiatanMap: Record<string, PulsaAlokasiDetail>
      daftarAlokasi: PulsaAlokasiDetail[]
      totalAjuan: number
      totalDisetujui: number
    }
  >()

  let totalAlokasi = 0
  let totalDisetujuiOrg = 0
  let totalNominalAjuan = 0
  let totalDisetujuiPpk = 0

  const kegiatanList: PulsaKegiatanItem[] = kegiatanDb.map((keg) => {
    let jumlahDisetujui = 0
    let kegTotalAjuan = 0
    let kegTotalDisetujui = 0

    const alokasiDetails: PulsaAlokasiDetail[] = keg.alokasi.map((alo) => {
      const petugasId =
        alo.tipePetugas === 'ORGANIK'
          ? (alo.pegawaiId ?? alo.id)
          : (alo.mitraId ?? alo.id)
      const namaPetugas =
        alo.tipePetugas === 'ORGANIK'
          ? (alo.pegawai?.nama ?? 'Pegawai Tidak Ditemukan')
          : (alo.mitra?.nama ?? 'Mitra Tidak Ditemukan')

      const detail: PulsaAlokasiDetail = {
        id: alo.id,
        kegiatanId: keg.id,
        namaKegiatan: keg.namaKegiatan,
        tipePetugas: alo.tipePetugas,
        petugasId,
        namaPetugas,
        nominal: alo.nominal,
        status: alo.status,
        catatanVerifikasi: alo.catatanVerifikasi,
        diverifikasiAt: alo.diverifikasiAt ? alo.diverifikasiAt.toISOString() : null,
      }

      totalAlokasi += 1
      kegTotalAjuan += alo.nominal
      totalNominalAjuan += alo.nominal

      if (alo.status === 'DISETUJUI') {
        jumlahDisetujui += 1
        totalDisetujuiOrg += 1
        kegTotalDisetujui += alo.nominal
        totalDisetujuiPpk += alo.nominal
      }

      const key = `${alo.tipePetugas}:${petugasId}`
      const existing = petugasMap.get(key)
      if (!existing) {
        petugasMap.set(key, {
          key,
          petugasId,
          nama: namaPetugas,
          tipe: alo.tipePetugas,
          kegiatanMap: { [keg.id]: detail },
          daftarAlokasi: [detail],
          totalAjuan: alo.nominal,
          totalDisetujui: alo.status === 'DISETUJUI' ? alo.nominal : 0,
        })
      } else {
        existing.kegiatanMap[keg.id] = detail
        existing.daftarAlokasi.push(detail)
        existing.totalAjuan += alo.nominal
        if (alo.status === 'DISETUJUI') {
          existing.totalDisetujui += alo.nominal
        }
      }

      return detail
    })

    return {
      id: keg.id,
      bulan: keg.bulan,
      tahun: keg.tahun,
      namaKegiatan: keg.namaKegiatan,
      nominalPerOrang: keg.nominalPerOrang,
      keterangan: keg.keterangan,
      jumlahPetugas: keg.alokasi.length,
      jumlahDisetujui,
      totalAjuan: kegTotalAjuan,
      totalDisetujui: kegTotalDisetujui,
      alokasi: alokasiDetails,
    }
  })

  const petugasRows: PulsaPetugasRow[] = Array.from(petugasMap.values())
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
    .map((p) => {
      const allApproved =
        p.daftarAlokasi.length > 0 &&
        p.daftarAlokasi.every((a) => a.status === 'DISETUJUI')
      const anyApproved = p.daftarAlokasi.some((a) => a.status === 'DISETUJUI')
      const allRejected =
        p.daftarAlokasi.length > 0 &&
        p.daftarAlokasi.every((a) => a.status === 'DITOLAK')

      const statusKeseluruhan = allApproved
        ? 'SEMUA_DISETUJUI'
        : anyApproved
          ? 'SEBAGIAN_DISETUJUI'
          : allRejected
            ? 'DITOLAK'
            : 'MENUNGGU'

      return {
        ...p,
        isDuplikasi: p.daftarAlokasi.length > 1,
        jumlahKegiatan: p.daftarAlokasi.length,
        statusKeseluruhan,
      }
    })

  const totalOrganik = petugasRows.filter((p) => p.tipe === 'ORGANIK').length
  const totalMitra = petugasRows.filter((p) => p.tipe === 'MITRA').length

  return {
    periode: {
      bulan,
      tahun,
      label: `${getNamaBulan(bulan)} ${tahun}`,
    },
    currentUserRole: userRole,
    canManage: ROLES_CAN_MANAGE.has(userRole),
    canApprove: ROLES_CAN_APPROVE.has(userRole),
    summary: {
      totalPetugas: petugasRows.length,
      totalOrganik,
      totalMitra,
      totalKegiatan: kegiatanList.length,
      totalAlokasi,
      totalDisetujuiOrg,
      totalNominalAjuan,
      totalDisetujuiPpk,
      terbilangDisetujui: terbilangRupiah(totalDisetujuiPpk),
    },
    kegiatanList,
    petugasRows,
    masterPegawai,
    masterMitra,
  }
}

export async function createAjuanPulsa(
  input: CreateAjuanPulsaInput,
  userId: string,
) {
  const uniquePegawaiIds = Array.from(new Set(input.pegawaiIds))
  const uniqueMitraIds = Array.from(new Set(input.mitraIds))

  return prisma.monitoringPulsaKegiatan.create({
    data: {
      bulan: input.bulan,
      tahun: input.tahun,
      namaKegiatan: input.namaKegiatan,
      nominalPerOrang: input.nominalPerOrang,
      keterangan: input.keterangan || null,
      dibuatOlehId: userId,
      alokasi: {
        create: [
          ...uniquePegawaiIds.map((pegawaiId) => ({
            tipePetugas: 'ORGANIK' as const,
            pegawaiId,
            nominal: input.nominalPerOrang,
            status: 'DIAJUKAN' as const,
          })),
          ...uniqueMitraIds.map((mitraId) => ({
            tipePetugas: 'MITRA' as const,
            mitraId,
            nominal: input.nominalPerOrang,
            status: 'DIAJUKAN' as const,
          })),
        ],
      },
    },
  })
}

export async function updateKegiatanPulsa(
  kegiatanId: string,
  input: UpdateKegiatanPulsaInput,
) {
  const existing = await prisma.monitoringPulsaKegiatan.findUnique({
    where: { id: kegiatanId },
    include: { alokasi: true },
  })

  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Data kegiatan pulsa tidak ditemukan.')
  }

  const uniquePegawaiIds = Array.from(new Set(input.pegawaiIds))
  const uniqueMitraIds = Array.from(new Set(input.mitraIds))

  const existingPegawaiMap = new Map(
    existing.alokasi
      .filter((a) => a.tipePetugas === 'ORGANIK' && a.pegawaiId)
      .map((a) => [a.pegawaiId!, a]),
  )
  const existingMitraMap = new Map(
    existing.alokasi
      .filter((a) => a.tipePetugas === 'MITRA' && a.mitraId)
      .map((a) => [a.mitraId!, a]),
  )

  return prisma.$transaction(async (tx) => {
    await tx.monitoringPulsaKegiatan.update({
      where: { id: kegiatanId },
      data: {
        namaKegiatan: input.namaKegiatan,
        nominalPerOrang: input.nominalPerOrang,
        keterangan: input.keterangan || null,
      },
    })

    // Hapus alokasi yang dicabut
    await tx.monitoringPulsaAlokasi.deleteMany({
      where: {
        kegiatanId,
        OR: [
          {
            tipePetugas: 'ORGANIK',
            pegawaiId: { notIn: uniquePegawaiIds },
          },
          {
            tipePetugas: 'MITRA',
            mitraId: { notIn: uniqueMitraIds },
          },
        ],
      },
    })

    // Upsert Organik
    for (const pegawaiId of uniquePegawaiIds) {
      const prev = existingPegawaiMap.get(pegawaiId)
      if (prev) {
        await tx.monitoringPulsaAlokasi.update({
          where: { id: prev.id },
          data: { nominal: input.nominalPerOrang },
        })
      } else {
        await tx.monitoringPulsaAlokasi.create({
          data: {
            kegiatanId,
            tipePetugas: 'ORGANIK',
            pegawaiId,
            nominal: input.nominalPerOrang,
            status: 'DIAJUKAN',
          },
        })
      }
    }

    // Upsert Mitra
    for (const mitraId of uniqueMitraIds) {
      const prev = existingMitraMap.get(mitraId)
      if (prev) {
        await tx.monitoringPulsaAlokasi.update({
          where: { id: prev.id },
          data: { nominal: input.nominalPerOrang },
        })
      } else {
        await tx.monitoringPulsaAlokasi.create({
          data: {
            kegiatanId,
            tipePetugas: 'MITRA',
            mitraId,
            nominal: input.nominalPerOrang,
            status: 'DIAJUKAN',
          },
        })
      }
    }
  })
}

export async function bulkUpdateStatusKegiatan(
  kegiatanId: string,
  status: StatusPersetujuanPulsa,
  verifikatorId: string,
) {
  const existing = await prisma.monitoringPulsaKegiatan.findUnique({
    where: { id: kegiatanId },
  })
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Kegiatan pulsa tidak ditemukan.')
  }

  return prisma.monitoringPulsaAlokasi.updateMany({
    where: { kegiatanId },
    data: {
      status,
      diverifikasiOlehId: status === 'DIAJUKAN' ? null : verifikatorId,
      diverifikasiAt: status === 'DIAJUKAN' ? null : new Date(),
    },
  })
}

export async function deleteKegiatanPulsa(kegiatanId: string) {
  const existing = await prisma.monitoringPulsaKegiatan.findUnique({
    where: { id: kegiatanId },
  })
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Kegiatan pulsa tidak ditemukan.')
  }

  return prisma.monitoringPulsaKegiatan.delete({
    where: { id: kegiatanId },
  })
}

export async function verifikasiAlokasiPulsa(params: {
  alokasiId: string
  status: StatusPersetujuanPulsa
  catatanVerifikasi?: string
  verifikatorId: string
}) {
  const existing = await prisma.monitoringPulsaAlokasi.findUnique({
    where: { id: params.alokasiId },
  })
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Data alokasi pulsa tidak ditemukan.')
  }

  return prisma.monitoringPulsaAlokasi.update({
    where: { id: params.alokasiId },
    data: {
      status: params.status,
      catatanVerifikasi: params.catatanVerifikasi ?? null,
      diverifikasiOlehId:
        params.status === 'DIAJUKAN' ? null : params.verifikatorId,
      diverifikasiAt: params.status === 'DIAJUKAN' ? null : new Date(),
    },
  })
}

export async function createMitraStatistik(input: {
  nama: string
  sobatId?: string
  noHp?: string
  kecamatan?: string
}) {
  return prisma.mitraStatistik.create({
    data: {
      nama: input.nama,
      sobatId: input.sobatId || null,
      noHp: input.noHp || null,
      kecamatan: input.kecamatan || null,
    },
  })
}
