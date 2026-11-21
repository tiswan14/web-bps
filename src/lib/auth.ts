import { cache } from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { readSessionUserId } from '@/lib/session'

export const getCurrentUser = cache(async () => {
  const userId = await readSessionUserId()
  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      pegawai: { select: { nama: true, jabatan: true } },
    },
  })

  return user?.isActive ? user : null
})

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
