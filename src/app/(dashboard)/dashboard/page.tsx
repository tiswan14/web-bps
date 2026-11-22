import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dashboard | Web BPS',
}

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <section className="space-y-2">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Selamat Datang
        </h2>
        <p className="text-sm text-muted-foreground">
          Halo, {user.pegawai?.nama ?? user.username}. Selamat bekerja.
        </p>
      </div>
    </section>
  )
}
