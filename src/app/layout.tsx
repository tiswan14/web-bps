import type { Metadata } from 'next'
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthToast } from '@/components/auth-toast'
import './globals.css'

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})



export const metadata: Metadata = {
  title: 'Web BPS Kab. Pangandaran',
  description: 'Sistem Administrasi Digital BPS Kabupaten Pangandaran',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          {children}
          <AuthToast />
          <Toaster position="top-right" theme="light" richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
