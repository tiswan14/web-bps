
import { NextResponse } from 'next/server'
import { deleteSession, readSessionUserId } from '@/lib/session'

export async function POST() {
  try {
    const userId = await readSessionUserId()

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session tidak ditemukan atau sudah berakhir',
        },
        { status: 401 },
      )
    }

    await deleteSession()

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    })
  } catch (error) {
    console.error('[POST /api/auth/logout]', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal melakukan logout',
      },
      { status: 500 },
    )
  }
}
