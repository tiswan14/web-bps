
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'

type RouteContext = {
  params: Promise<{ id: string }>
}

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

const pegawaiSelect = {
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
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const auth = await authorize()

    if (!auth.authorized) return auth.response

    const { id } = await params

    const data = await prisma.pegawai.findUnique({
      where: { id },
      select: pegawaiSelect,
    })

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Pegawai tidak ditemukan' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Detail pegawai berhasil diambil',
      data,
    })
  } catch (error) {
    console.error('[GET /api/pegawai/:id]', error)

    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail pegawai' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const auth = await authorize()

    if (!auth.authorized) return auth.response

    const { id } = await params
    const body: unknown = await request.json()

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: 'Format request tidak valid' },
        { status: 400 },
      )
    }

    const payload = body as Record<string, unknown>

    const existing = await prisma.pegawai.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Pegawai tidak ditemukan' },
        { status: 404 },
      )
    }

    const allowedFields = [
      'nama',
      'nip',
      'email',
      'nipBps',
      'golonganAkhir',
      'pangkat',
      'jabatan',
      'fungsiId',
      'aktif',
    ]

    const invalidFields = Object.keys(payload).filter(
      (field) => !allowedFields.includes(field),
    )

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Terdapat field yang tidak diizinkan',
          fields: invalidFields,
        },
        { status: 400 },
      )
    }

    const data: {
      nama?: string
      nip?: string
      email?: string | null
      nipBps?: string | null
      golonganAkhir?: string | null
      pangkat?: string | null
      jabatan?: string | null
      fungsiId?: string | null
      aktif?: boolean
    } = {}

    const textFields = [
      'nama',
      'nip',
      'email',
      'nipBps',
      'golonganAkhir',
      'pangkat',
      'jabatan',
      'fungsiId',
    ] as const

    for (const field of textFields) {
      if (!(field in payload)) continue

      const value = payload[field]

      if (value !== null && typeof value !== 'string') {
        return NextResponse.json(
          { success: false, message: `Field ${field} harus berupa teks` },
          { status: 400 },
        )
      }

      const normalized = typeof value === 'string' ? value.trim() : null

      if (
        (field === 'nama' || field === 'nip') &&
        !normalized
      ) {
        return NextResponse.json(
          { success: false, message: `Field ${field} tidak boleh kosong` },
          { status: 400 },
        )
      }

      if (field === 'nama') data.nama = normalized ?? ''
      if (field === 'nip') data.nip = normalized ?? ''
      if (field === 'email') data.email = normalized || null
      if (field === 'nipBps') data.nipBps = normalized || null
      if (field === 'golonganAkhir') data.golonganAkhir = normalized || null
      if (field === 'pangkat') data.pangkat = normalized || null
      if (field === 'jabatan') data.jabatan = normalized || null
      if (field === 'fungsiId') data.fungsiId = normalized || null
    }

    if ('aktif' in payload) {
      if (typeof payload.aktif !== 'boolean') {
        return NextResponse.json(
          { success: false, message: 'Field aktif harus berupa boolean' },
          { status: 400 },
        )
      }

      data.aktif = payload.aktif
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada data untuk diperbarui' },
        { status: 400 },
      )
    }

    if (data.fungsiId) {
      const fungsi = await prisma.fungsi.findUnique({
        where: { id: data.fungsiId },
        select: { id: true },
      })

      if (!fungsi) {
        return NextResponse.json(
          { success: false, message: 'Fungsi tidak ditemukan' },
          { status: 404 },
        )
      }
    }

    const duplicate = await prisma.pegawai.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(data.nip ? [{ nip: data.nip }] : []),
          ...(data.email ? [{ email: data.email }] : []),
          ...(data.nipBps ? [{ nipBps: data.nipBps }] : []),
        ],
      },
      select: { id: true },
    })

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIP, email, atau NIP BPS sudah digunakan pegawai lain',
        },
        { status: 409 },
      )
    }

    const updated = await prisma.pegawai.update({
      where: { id },
      data,
      select: pegawaiSelect,
    })

    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil diperbarui',
      data: updated,
    })
  } catch (error) {
    console.error('[PATCH /api/pegawai/:id]', error)

    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data pegawai' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const auth = await authorize()

    if (!auth.authorized) return auth.response

    const { id } = await params

    const existing = await prisma.pegawai.findUnique({
      where: { id },
      select: { id: true, nama: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Pegawai tidak ditemukan' },
        { status: 404 },
      )
    }

    await prisma.pegawai.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Pegawai berhasil dihapus',
      data: existing,
    })
  } catch (error) {
    console.error('[DELETE /api/pegawai/:id]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus pegawai. Periksa relasi data terkait.',
      },
      { status: 409 },
    )
  }
}
