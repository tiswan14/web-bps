
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

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: 'Format request tidak valid' },
        { status: 400 },
      )
    }

    const payload = body as Record<string, unknown>

    const nama = typeof payload.nama === 'string' ? payload.nama.trim() : ''
    const nip = typeof payload.nip === 'string' ? payload.nip.trim() : ''

    const email =
      typeof payload.email === 'string' ? payload.email.trim() || null : null

    const nipBps =
      typeof payload.nipBps === 'string'
        ? payload.nipBps.trim() || null
        : null

    const golonganAkhir =
      typeof payload.golonganAkhir === 'string'
        ? payload.golonganAkhir.trim() || null
        : null

    const pangkat =
      typeof payload.pangkat === 'string'
        ? payload.pangkat.trim() || null
        : null

    const jabatan =
      typeof payload.jabatan === 'string'
        ? payload.jabatan.trim() || null
        : null

    const fungsiId =
      typeof payload.fungsiId === 'string'
        ? payload.fungsiId.trim() || null
        : null

    if (!nama || !nip) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama dan NIP wajib diisi',
        },
        { status: 400 },
      )
    }

    const existingPegawai = await prisma.pegawai.findFirst({
      where: {
        OR: [
          { nip },
          ...(email ? [{ email }] : []),
          ...(nipBps ? [{ nipBps }] : []),
        ],
      },
      select: { nip: true, email: true, nipBps: true },
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
        nip,
        email,
        nipBps,
        golonganAkhir,
        pangkat,
        jabatan,
        fungsiId,
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
