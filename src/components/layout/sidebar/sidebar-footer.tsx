
import Image from 'next/image'
import { SidebarFooter as SidebarFooterContainer } from '@/components/ui/sidebar'

export function SidebarFooter() {
  return (
    <SidebarFooterContainer className='mt-auto px-3 pb-3'>
      <div className='flex items-center gap-2 rounded-lg border border-border bg-card p-2'>
        <Image
          src='/images/logo.png'
          alt='Logo BPS Kabupaten Pangandaran'
          width={40}
          height={40}
          className='size-10 shrink-0 object-contain'
        />

        <p className='min-w-0 flex-1 text-xs font-semibold leading-tight text-foreground'>
          BPS Kabupaten Pangandaran
        </p>
      </div>
    </SidebarFooterContainer>
  )
}
