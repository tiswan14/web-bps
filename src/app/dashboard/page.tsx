import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { requireUser } from '@/lib/auth'
import { logoutAction } from '@/lib/auth-actions'

export const metadata: Metadata = {
  title: 'Dashboard | SIMARLIN',
}

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>
        Halo, {user.pegawai?.nama ?? user.username} ({user.role})
      </p>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Keluar
        </Button>
      </form>
    </main>
  )
}
