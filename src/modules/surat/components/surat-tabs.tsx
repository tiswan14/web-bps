import { cn } from '@/lib/utils'
import {
  TAB_CONFIG,
  TAB_ORDER,
  type TabSurat,
} from '@/modules/surat/constants/surat-tabs'

interface SuratTabsProps {
  activeTab: TabSurat
  onChange: (tab: TabSurat) => void
}

export function SuratTabs({ activeTab, onChange }: SuratTabsProps) {
  return (
    <div className='flex'>
      <div className='inline-flex rounded-lg bg-muted p-1'>
        {TAB_ORDER.map((tab) => (
          <button
            key={tab}
            type='button'
            onClick={() => onChange(tab)}
            className={cn(
              'cursor-pointer rounded-md px-4 py-1.5 text-xs font-medium transition-all',
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {TAB_CONFIG[tab].label}
          </button>
        ))}
      </div>
    </div>
  )
}
