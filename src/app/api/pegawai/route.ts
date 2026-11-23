
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { createPegawaiSchema } from '@/modules/pegawai/validations/pegawai.schema'

async function authorize() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 },
      ),
    }
  }

  if (!hasPermission(user.role, 'pegawai.manage')) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 },
      ),
    }
  }

  return { authorized: true as const }
}

function getPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authorize()

    if (!auth.authorized) return auth.response

    const searchParams = request.nextUrl.searchParams

    const page = getPositiveInteger(searchParams.get('page'), 1)
    const limit = Math.min(
      getPositiveInteger(searchParams.get('limit'), 10),
      100,
    )

    const search = searchParams.get('search')?.trim() ?? ''
    const golongan = searchParams.get('golongan')?.trim()
    const jabatan = searchParams.get('jabatan')?.trim()
    const aktifParam = searchParams.get('aktif')
    const kategori = searchParams.get('kategori')

    const where = {
      ...(kategori === 'pengelola-anggaran'
        ? { fungsiId: { not: null } }
        : {}),
      ...(search
        ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' as const } },
            { nip: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { nipBps: { contains: search } },
          ],
        }
        : {}),
      ...(golongan ? { golonganAkhir: golongan } : {}),
      ...(jabatan
        ? { jabatan: { contains: jabatan, mode: 'insensitive' as const } }
        : {}),
      ...(aktifParam === 'true'
        ? { aktif: true }
        : aktifParam === 'false'
          ? { aktif: false }
          : {}),
    }

    const [data, total] = await prisma.$transaction([
      prisma.pegawai.findMany({
        where,
        select: {
          id: true,
          nama: true,
          nip: true,
          email: true,
          nipBps: true,
          golonganAkhir: true,
          pangkat: true,
          jabatan: true,
          aktif: true,
          fungsi: {
            select: {
              id: true,
              nama: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { nama: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pegawai.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil diambil',
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[GET /api/pegawai]', error)

    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pegawai' },
      { status: 500 },
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const auth = await authorize()

    if (!auth.authorized) return auth.response

    const body: unknown = await request.json()
    const validation = createPegawaiSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validasi data gagal',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const payload = validation.data

    const existingPegawai = await prisma.pegawai.findFirst({
      where: {
        OR: [
          { nip: payload.nip },
          ...(payload.email
            ? [{ email: payload.email }]
            : []),
          ...(payload.nipBps
            ? [{ nipBps: payload.nipBps }]
            : []),
        ],
      },
      select: { id: true },
    })

    if (existingPegawai) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIP, email, atau NIP BPS sudah terdaftar',
        },
        { status: 409 },
      )
    }

    if (payload.fungsiId) {
      const fungsi = await prisma.fungsi.findUnique({
        where: { id: payload.fungsiId },
        select: { id: true },
      })

      if (!fungsi) {
        return NextResponse.json(
          { success: false, message: 'Fungsi tidak ditemukan' },
          { status: 404 },
        )
      }
    }

    const data = await prisma.pegawai.create({
      data: {
        ...payload,
        email: payload.email || null,
      },
      select: {
        id: true,
        nama: true,
        nip: true,
        email: true,
        nipBps: true,
        golonganAkhir: true,
        pangkat: true,
        jabatan: true,
        aktif: true,
        fungsi: {
          select: {
            id: true,
            nama: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Pegawai berhasil ditambahkan',
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[POST /api/pegawai]', error)

    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan pegawai' },
      { status: 500 },
    )
  }
}

