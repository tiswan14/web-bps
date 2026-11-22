import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const periode = await prisma.periode.findMany({
      orderBy: {
        tahun: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: periode,
    })
  } catch (error) {
    console.error('GET /api/periode:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data periode',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tahun = Number(body.tahun)

    if (!Number.isInteger(tahun) || tahun < 2000 || tahun > 2100) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tahun periode tidak valid',
        },
        { status: 400 },
      )
    }

    const periode = await prisma.periode.create({
      data: {
        tahun,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Periode berhasil ditambahkan',
        data: periode,
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
          message: 'Periode tersebut sudah tersedia',
        },
        { status: 409 },
      )
    }

    console.error('POST /api/periode:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan periode',
      },
      { status: 500 },
    )
  }
}
