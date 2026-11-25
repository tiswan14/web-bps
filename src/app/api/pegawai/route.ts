
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'

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

function getString(payload: Record<string, unknown>, key: string) {
  return typeof payload[key] === 'string'
    ? (payload[key] as string).trim()
    : ''
}

function getNullableString(payload: Record<string, unknown>, key: string) {
  return getString(payload, key) || null
}

const pegawaiSelect = {
  id: true,
  nama: true,
  nipLama: true,
  nipBaru: true,
  nik: true,
  email: true,
  noHp: true,
  golongan: true,
  pangkat: true,
  jabatan: true,
  pendidikan: true,
  npwp: true,
  rekening: true,
  bank: true,
  linkSkJabatan: true,
  linkSkPangkat: true,
  foto: true,
  aktif: true,
  fungsi: {
    select: {
      id: true,
      nama: true,
    },
  },
  createdAt: true,
  updatedAt: true,
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
              {
                nama: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              { nipLama: { contains: search } },
              { nipBaru: { contains: search } },
              { nik: { contains: search } },
              {
                email: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
      ...(golongan ? { golongan } : {}),
      ...(jabatan
        ? {
            jabatan: {
              contains: jabatan,
              mode: 'insensitive' as const,
            },
          }
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
        select: pegawaiSelect,
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

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: 'Format request tidak valid' },
        { status: 400 },
      )
    }

    const payload = body as Record<string, unknown>

    const nama = getString(payload, 'nama')
    const nipLama = getString(payload, 'nipLama')
    const nipBaru = getString(payload, 'nipBaru')
    const nik = getString(payload, 'nik')
    const jabatan = getString(payload, 'jabatan')
    const golongan = getString(payload, 'golongan')
    const pangkat = getString(payload, 'pangkat')
    const userId = getString(payload, 'userId')

    if (
      !nama ||
      !nipLama ||
      !nipBaru ||
      !nik ||
      !jabatan ||
      !golongan ||
      !pangkat ||
      !userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nama, NIP lama, NIP baru, NIK, jabatan, golongan, pangkat, dan akun pengguna wajib diisi',
        },
        { status: 400 },
      )
    }

    const existingPegawai = await prisma.pegawai.findFirst({
      where: {
        OR: [
          { nipLama },
          { nipBaru },
          { nik },
        ],
      },
      select: {
        id: true,
      },
    })

    if (existingPegawai) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIP lama, NIP baru, atau NIK sudah terdaftar',
        },
        { status: 409 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        pegawai: {
          select: { id: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Akun pengguna tidak ditemukan' },
        { status: 404 },
      )
    }

    if (user.pegawai) {
      return NextResponse.json(
        {
          success: false,
          message: 'Akun pengguna sudah terhubung dengan pegawai lain',
        },
        { status: 409 },
      )
    }

    const fungsiId = getNullableString(payload, 'fungsiId')

    if (fungsiId) {
      const fungsi = await prisma.fungsi.findUnique({
        where: { id: fungsiId },
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
        nama,
        nipLama,
        nipBaru,
        nik,
        jabatan,
        golongan,
        pangkat,
        pendidikan: getNullableString(payload, 'pendidikan'),
        noHp: getNullableString(payload, 'noHp'),
        email: getNullableString(payload, 'email'),
        npwp: getNullableString(payload, 'npwp'),
        rekening: getNullableString(payload, 'rekening'),
        bank: getNullableString(payload, 'bank'),
        linkSkJabatan: getNullableString(payload, 'linkSkJabatan'),
        linkSkPangkat: getNullableString(payload, 'linkSkPangkat'),
        foto: getNullableString(payload, 'foto'),
        fungsiId,
        userId,
      },
      select: pegawaiSelect,
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
