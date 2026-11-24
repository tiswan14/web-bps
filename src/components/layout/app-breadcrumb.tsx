'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { breadcrumbLabels } from '@/config/breadcrumb'

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment) => ({
    label:
      breadcrumbLabels[segment] ??
      segment
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase()),
  }))

  

  return (
    <nav
      aria-label='Breadcrumb'
      className='flex min-w-0 items-center gap-2 text-sm'
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div
            key={`${item.label}-${index}`}
            className='flex min-w-0 items-center gap-2'
          >
            {index > 0 && (
              <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
            )}

            <span
              aria-current={isLast ? 'page' : undefined}
              className={
                isLast
                  ? 'truncate font-medium text-foreground'
                  : 'truncate text-muted-foreground'
              }
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}