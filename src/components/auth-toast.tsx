'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function AuthToast() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const auth = searchParams.get('auth')

    if (auth === 'login-success') {
      toast.success('Login Berhasil', {
        description: 'Selamat datang di Web BPS Kab. Pangandaran.',
      })
    }

    if (auth === 'logout-success') {
      toast.success('Logout Berhasil', {
        description: 'Sesi Anda telah berakhir.',
      })
    }

    if (auth) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('auth')

      const query = params.toString()
      const url = query ? `${pathname}?${query}` : pathname

      window.history.replaceState(null, '', url)
    }
  }, [pathname, searchParams])

  return null
}
