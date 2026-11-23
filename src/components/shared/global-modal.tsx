import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface GlobalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  className?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
  full: 'sm:max-w-[calc(100%-2rem)]',
}

export function GlobalModal({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  footer,
  size = 'md',
  className,
}: GlobalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0',
          sizeClasses[size],
          className,
        )}
      >
        {/* Header */}
        <DialogHeader className='relative shrink-0 space-y-0 border-b bg-linear-to-br from-primary/10 via-primary/5 to-transparent px-6 py-5'>
          <div className='pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl' />

          <div className='relative flex items-center gap-4 pr-8'>
            {Icon && (
              <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25'>
                <Icon className='size-5' />
              </div>
            )}

            <div className='min-w-0 flex-1 text-left'>
              <DialogTitle className='text-lg font-semibold tracking-tight'>
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className='mt-1 text-sm'>
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Body (scrollable) */}
        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
          {children}
        </div>

        {/* Footer (opsional) */}
        {footer && (
          <DialogFooter className='shrink-0 gap-2 border-t bg-muted/30 px-6 py-4 sm:justify-end'>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}