import type { ReactNode } from 'react'

type PageToolbarProps = {
  search?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
}

export function PageToolbar({
  search,
  filters,
  actions,
}: PageToolbarProps) {
  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row'>
        {search}
        {filters}
      </div>

      {actions && (
        <div className='flex shrink-0 items-center gap-2'>
          {actions}
        </div>
      )}
    </div>
  )
}
