
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import bcrypt from 'bcryptjs'

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

function getString(payload: Record<string, unknown>, key: string) {
  return typeof payload[key] === 'string'
    ? (payload[key] as string).trim()
    : ''
}

function isObjectPayload(
  body: unknown,
): body is Record<string, unknown> {
  return (
    typeof body === 'object' &&
    body !== null &&
    !Array.isArray(body)
  )
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
} satisfies Prisma.PegawaiSelect


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
      select: {
        ...pegawaiSelect,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
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

    if (!isObjectPayload(body)) {
      return NextResponse.json(
        { success: false, message: 'Format request tidak valid' },
        { status: 400 },
      )
    }

    const payload = body

    const allowedFields = [
      'nama',
      'nipLama',
      'nipBaru',
      'nik',
      'jabatan',
      'golongan',
      'pangkat',
      'pendidikan',
      'email',
      'noHp',
      'npwp',
      'rekening',
      'bank',
      'linkSkJabatan',
      'linkSkPangkat',
      'foto',
      'aktif',
      'username',
      'emailAkun',
      'password',
      'isActive',
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

    const existing = await prisma.pegawai.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Pegawai tidak ditemukan' },
        { status: 404 },
      )
    }

    const requiredFields = [
      'nama',
      'nipLama',
      'nipBaru',
      'nik',
      'jabatan',
      'golongan',
      'pangkat',
    ] as const

    const optionalFields = [
      'pendidikan',
      'email',
      'noHp',
      'npwp',
      'rekening',
      'bank',
      'linkSkJabatan',
      'linkSkPangkat',
      'foto',
    ] as const

    const pegawaiData: Prisma.PegawaiUpdateInput = {}

    for (const field of requiredFields) {
      if (!(field in payload)) continue

      const value = payload[field]

      if (typeof value !== 'string' || !value.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: `Field ${field} wajib diisi`,
          },
          { status: 400 },
        )
      }

      Object.assign(pegawaiData, {
        [field]: value.trim(),
      })
    }

    for (const field of optionalFields) {
      if (!(field in payload)) continue

      const value = payload[field]

      if (value !== null && typeof value !== 'string') {
        return NextResponse.json(
          {
            success: false,
            message: `Field ${field} harus berupa teks`,
          },
          { status: 400 },
        )
      }

      Object.assign(pegawaiData, {
        [field]: typeof value === 'string'
          ? value.trim() || null
          : null,
      })
    }

    if ('aktif' in payload) {
      if (typeof payload.aktif !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            message: 'Field aktif harus berupa boolean',
          },
          { status: 400 },
        )
      }

      pegawaiData.aktif = payload.aktif
    }

    const userData: Prisma.UserUpdateInput = {}

    if ('username' in payload) {
      const username = getString(payload, 'username')

      if (!username) {
        return NextResponse.json(
          {
            success: false,
            message: 'Username tidak boleh kosong',
          },
          { status: 400 },
        )
      }

      userData.username = username
    }

    if ('emailAkun' in payload) {
      const emailAkun = getString(payload, 'emailAkun')

      if (!emailAkun) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email akun tidak boleh kosong',
          },
          { status: 400 },
        )
      }

      userData.email = emailAkun
    }

    if ('password' in payload) {
      const password = getString(payload, 'password')

      if (password) {
        if (password.length < 8) {
          return NextResponse.json(
            {
              success: false,
              message: 'Password minimal 8 karakter',
            },
            { status: 400 },
          )
        }

        userData.passwordHash = await bcrypt.hash(password, 12)
      }
    }

    if ('isActive' in payload) {
      if (typeof payload.isActive !== 'boolean') {
        return NextResponse.json(
          {
            success: false,
            message: 'Field isActive harus berupa boolean',
          },
          { status: 400 },
        )
      }

      userData.isActive = payload.isActive
    }

    const hasPegawaiChanges = Object.keys(pegawaiData).length > 0
    const hasUserChanges = Object.keys(userData).length > 0

    if (!hasPegawaiChanges && !hasUserChanges) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak ada data untuk diperbarui',
        },
        { status: 400 },
      )
    }

    const userId = existing.userId

    if (hasUserChanges && !userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pegawai belum memiliki akun pengguna',
        },
        { status: 409 },
      )
    }

    // Periksa duplikasi identitas pegawai
    const duplicatePegawai = await prisma.pegawai.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(typeof pegawaiData.nipLama === 'string'
            ? [{ nipLama: pegawaiData.nipLama }]
            : []),
          ...(typeof pegawaiData.nipBaru === 'string'
            ? [{ nipBaru: pegawaiData.nipBaru }]
            : []),
          ...(typeof pegawaiData.nik === 'string'
            ? [{ nik: pegawaiData.nik }]
            : []),
        ],
      },
      select: { id: true },
    })

    if (duplicatePegawai) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIP lama, NIP baru, atau NIK sudah terdaftar',
        },
        { status: 409 },
      )
    }

    // Periksa duplikasi akun
    if (hasUserChanges && userId) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          id: { not: userId },
          OR: [
            ...(typeof userData.username === 'string'
              ? [{ username: userData.username }]
              : []),
            ...(typeof userData.email === 'string'
              ? [{ email: userData.email }]
              : []),
          ],
        },
        select: { id: true },
      })

      if (duplicateUser) {
        return NextResponse.json(
          {
            success: false,
            message: 'Username atau email akun sudah digunakan',
          },
          { status: 409 },
        )
      }
    }

    // Update pegawai dan akun secara atomik
    const updated = await prisma.$transaction(async (tx) => {
      if (hasPegawaiChanges) {
        await tx.pegawai.update({
          where: { id },
          data: pegawaiData,
        })
      }

      if (hasUserChanges && userId) {
        await tx.user.update({
          where: { id: userId },
          data: userData,
        })
      }

      return tx.pegawai.findUniqueOrThrow({
        where: { id },
        select: {
          ...pegawaiSelect,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Data pegawai berhasil diperbarui',
      data: updated,
    })
  } catch (error) {
    console.error('[PATCH /api/pegawai/:id]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui data pegawai',
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
    const auth = await authorize()

    if (!auth.authorized) return auth.response

    const { id } = await params

    const existing = await prisma.pegawai.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
      },
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
