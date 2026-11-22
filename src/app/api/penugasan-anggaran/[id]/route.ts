import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { JenisPenugasanAnggaran } from '@/generated/prisma/client'

type RouteContext = {
  params: Promise<{ id: string }>
}

const jenisPenugasan = Object.values(JenisPenugasanAnggaran)

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params

    const data = await prisma.penugasanAnggaran.findUnique({
      where: { id },
      include: {
        pegawai: true,
        periode: true,
      },
    })

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Penugasan anggaran tidak ditemukan',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('GET /api/penugasan-anggaran/[id]:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil detail penugasan anggaran',
      },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.penugasanAnggaran.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Penugasan anggaran tidak ditemukan',
        },
        { status: 404 },
      )
    }

    const dataUpdate: {
      pegawaiId?: string
      periodeId?: number
      jenis?: JenisPenugasanAnggaran
    } = {}

    if (body.pegawaiId !== undefined) {
      if (typeof body.pegawaiId !== 'string' || !body.pegawaiId.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: 'Pegawai tidak valid',
          },
          { status: 400 },
        )
      }

      const pegawai = await prisma.pegawai.findUnique({
        where: { id: body.pegawaiId },
      })

      if (!pegawai) {
        return NextResponse.json(
          {
            success: false,
            message: 'Pegawai tidak ditemukan',
          },
          { status: 404 },
        )
      }

      dataUpdate.pegawaiId = body.pegawaiId
    }

    if (body.periodeId !== undefined) {
      const periodeId = Number(body.periodeId)

      if (!Number.isInteger(periodeId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Periode tidak valid',
          },
          { status: 400 },
        )
      }

      const periode = await prisma.periode.findUnique({
        where: { tahun: periodeId },
      })

      if (!periode) {
        return NextResponse.json(
          {
            success: false,
            message: 'Periode tidak ditemukan',
          },
          { status: 404 },
        )
      }

      dataUpdate.periodeId = periodeId
    }

    if (body.jenis !== undefined) {
      if (
        typeof body.jenis !== 'string' ||
        !jenisPenugasan.includes(body.jenis as JenisPenugasanAnggaran)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Jenis penugasan tidak valid',
          },
          { status: 400 },
        )
      }

      dataUpdate.jenis = body.jenis as JenisPenugasanAnggaran
    }

    if (Object.keys(dataUpdate).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak ada data yang diperbarui',
        },
        { status: 400 },
      )
    }

    const data = await prisma.penugasanAnggaran.update({
      where: { id },
      data: dataUpdate,
      include: {
        pegawai: true,
        periode: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Penugasan anggaran berhasil diperbarui',
      data,
    })
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error
    ) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            success: false,
            message: 'Penugasan tersebut sudah terdaftar pada periode ini',
          },
          { status: 409 },
        )
      }

      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            success: false,
            message: 'Penugasan anggaran tidak ditemukan',
          },
          { status: 404 },
        )
      }
    }

    console.error('PATCH /api/penugasan-anggaran/[id]:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui penugasan anggaran',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params

    await prisma.penugasanAnggaran.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Penugasan anggaran berhasil dihapus',
    })
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Penugasan anggaran tidak ditemukan',
        },
        { status: 404 },
      )
    }

    console.error('DELETE /api/penugasan-anggaran/[id]:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus penugasan anggaran',
      },
      { status: 500 },
    )
  }
}
