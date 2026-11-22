
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Masuk | Web BPS Kab. Pangandaran',
}

export default async function LoginPage() {
  if (await getCurrentUser()) {
    redirect('/dashboard')
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left Section */}
      <section className="flex flex-col justify-center bg-primary px-8 py-16 text-primary-foreground sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
          <p className="mb-6 text-sm font-medium tracking-widest text-primary-foreground/60 uppercase">
            Badan Pusat Statistik
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Web BPS
            <span className="mt-2 block text-primary-foreground/70">
              Kab. Pangandaran
            </span>
          </h1>

          <div className="mt-8 h-1 w-16 rounded-full bg-primary-foreground" />

          <p className="mt-8 max-w-md text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Sistem administrasi digital untuk mendukung pengelolaan
            administrasi, pelayanan, dan koordinasi internal BPS
            Kabupaten Pangandaran secara lebih efektif dan terintegrasi.
          </p>

          <p className="mt-16 text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} BPS Kabupaten Pangandaran
          </p>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex items-center justify-center bg-background px-6 py-16 text-foreground sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Selamat Datang
            </h2>

            <p className="mt-3 text-base text-muted-foreground">
              Silakan masuk menggunakan akun yang telah terdaftar.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  )
}
