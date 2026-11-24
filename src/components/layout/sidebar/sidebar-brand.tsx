import Image from 'next/image'
import Link from 'next/link'
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function SidebarBrand() {
  return (
    <SidebarHeader className='relative h-16! min-h-16! justify-center border-b border-sidebar-border px-2 py-0'>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            tooltip='SIMARLIN - BPS Kab. Pangandaran'
            render={<Link href='/dashboard' />}
            className='h-16 cursor-pointer gap-2 px-2 hover:bg-sidebar-accent'
          >
            <Image
              src='/logo-simarlin3.png'
              alt='Logo SIMARLIN'
              width={112}
              height={112}
              priority
              className='size-14 shrink-0 object-contain'
            />

            <div className='min-w-0 flex-1 text-left leading-none'>
              <span className='block whitespace-nowrap text-sm font-bold tracking-tight text-foreground'>
                SIMARLIN
              </span>

              <span className='mt-0.5 block text-[10px] leading-tight text-muted-foreground'>
                Sistem Informasi Manajemen
                Administrasi dan Layanan Informasi
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute right-0 top-1/2 h-11 w-px -translate-y-1/2 rounded-full bg-border'
      />
    </SidebarHeader>
  )
}