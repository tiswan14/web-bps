import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthToast } from '@/components/auth-toast'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})



export const metadata: Metadata = {
  title: 'SIMARLIN | BPS Kabupaten Pangandaran',
  description: 'Sistem Informasi Manajemen Administrasi dan Layanan Informasi BPS Kabupaten Pangandaran',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='id'
      suppressHydrationWarning
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <AuthToast />
            <Toaster position='top-right' richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}