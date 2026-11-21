import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Masuk | SIMARLIN',
}

export default async function LoginPage() {
  if (await getCurrentUser()) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">SIMARLIN</h1>
          <p className="text-sm text-neutral-500">
            Sistem Informasi Manajemen Administrasi dan Layanan Kabupaten Pangandaran
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
