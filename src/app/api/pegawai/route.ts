import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import bcrypt from 'bcryptjs'

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

// Membuang field yang bernilai null dari response.
function omitNull<T extends Record<string, unknown>>(item: T) {
  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => value !== null),
  ) as Partial<T>
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

    const where = {
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
      data: data.map(omitNull),
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

    // Data pegawai
    const nama = getString(payload, 'nama')
    const nipLama = getString(payload, 'nipLama')
    const nipBaru = getString(payload, 'nipBaru')
    const nik = getString(payload, 'nik')
    const jabatan = getString(payload, 'jabatan')
    const golongan = getString(payload, 'golongan')
    const pangkat = getString(payload, 'pangkat')

    // Data akun
    const username = getString(payload, 'username')
    const emailAkun = getString(payload, 'emailAkun')
    const password = getString(payload, 'password')

    // Validasi data pegawai
    if (
      !nama ||
      !nipLama ||
      !nipBaru ||
      !nik ||
      !jabatan ||
      !golongan ||
      !pangkat
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nama, NIP lama, NIP baru, NIK, jabatan, golongan, dan pangkat wajib diisi',
        },
        { status: 400 },
      )
    }

    // Validasi data akun
    if (!username || !emailAkun || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username, email akun, dan password wajib diisi',
        },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password minimal 8 karakter',
        },
        { status: 400 },
      )
    }

    // Periksa duplikasi identitas pegawai
    const existingPegawai = await prisma.pegawai.findFirst({
      where: {
        OR: [{ nipLama }, { nipBaru }, { nik }],
      },
      select: { id: true },
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

    // Periksa duplikasi akun
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: emailAkun }],
      },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Username atau email akun sudah digunakan',
        },
        { status: 409 },
      )
    }

    // Hash password menggunakan bcrypt
    const passwordHash = await bcrypt.hash(password, 12)

    // Buat User dan Pegawai secara atomik
    const data = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          email: emailAkun,
          passwordHash,
          role: 'PEGAWAI',
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      })

      const pegawai = await tx.pegawai.create({
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
          userId: user.id,
        },
        select: pegawaiSelect,
      })

      return {
        pegawai,
        user,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Pegawai dan akun berhasil ditambahkan',
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('[POST /api/pegawai]', error)

    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan pegawai dan akun' },
      { status: 500 },
    )
  }
}


