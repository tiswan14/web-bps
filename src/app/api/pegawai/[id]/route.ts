
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { updatePegawaiSchema } from '@/modules/pegawai/validations/pegawai.schema'

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

    const validation = updatePegawaiSchema.safeParse(body)

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

    const duplicate = await prisma.pegawai.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(payload.nip ? [{ nip: payload.nip }] : []),
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

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIP, email, atau NIP BPS sudah digunakan pegawai lain',
        },
        { status: 409 },
      )
    }

    const { email, ...fields } = payload

    const updated = await prisma.pegawai.update({
      where: { id },
      data: {
        ...fields,
        ...(email !== undefined && {
          email: email || null,
        }),
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

    const updated = await prisma.pegawai.update({
      where: { id },
      data: {
        aktif: false,
      },
      select: {
        id: true,
        nama: true,
        aktif: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Pegawai berhasil dinonaktifkan',
      data: updated,
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
