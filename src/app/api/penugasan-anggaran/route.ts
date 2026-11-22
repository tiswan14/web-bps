import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { JenisPenugasanAnggaran } from '@/generated/prisma/client'

export async function GET() {
  try {
    const data = await prisma.penugasanAnggaran.findMany({
      include: {
        pegawai: true,
        periode: true,
      },
      orderBy: [
        { periodeId: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('GET /api/penugasan-anggaran:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data penugasan anggaran',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pegawaiId, periodeId, jenis } = body

    if (!pegawaiId || !periodeId || !jenis) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pegawai, periode, dan jenis penugasan wajib diisi',
        },
        { status: 400 },
      )
    }

    if (
      !Object.values(JenisPenugasanAnggaran).includes(jenis)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Jenis penugasan tidak valid',
        },
        { status: 400 },
      )
    }

    const periode = Number(periodeId)

    if (!Number.isInteger(periode)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Periode tidak valid',
        },
        { status: 400 },
      )
    }

    const [pegawai, dataPeriode] = await Promise.all([
      prisma.pegawai.findUnique({
        where: { id: pegawaiId },
      }),
      prisma.periode.findUnique({
        where: { tahun: periode },
      }),
    ])

    if (!pegawai) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pegawai tidak ditemukan',
        },
        { status: 404 },
      )
    }

    if (!dataPeriode) {
      return NextResponse.json(
        {
          success: false,
          message: 'Periode tidak ditemukan',
        },
        { status: 404 },
      )
    }

    const data = await prisma.penugasanAnggaran.create({
      data: {
        pegawaiId,
        periodeId: periode,
        jenis,
      },
      include: {
        pegawai: true,
        periode: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Penugasan anggaran berhasil ditambahkan',
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Penugasan tersebut sudah terdaftar pada periode ini',
        },
        { status: 409 },
      )
    }

    console.error('POST /api/penugasan-anggaran:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan penugasan anggaran',
      },
      { status: 500 },
    )
  }
}
