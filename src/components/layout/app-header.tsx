'use client'

import { useState } from 'react'
import {
  Bell,
  LogOut,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutDialog } from './logout-dialog'

import { AppBreadcrumb } from './app-breadcrumb'

type AppHeaderProps = {
  userName: string
  userRole: string
}

export function AppHeader({ userName, userRole }: AppHeaderProps) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const formattedUserName = userName
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

  const initials = formattedUserName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-3 rounded-r-xl border border-l-0 border-border bg-background px-4 sm:px-6'>
        {/* Breadcrumb */}
        <AppBreadcrumb />

        {/* Header actions */}
        <div className='flex shrink-0 items-center gap-3 sm:gap-4'>
          {/* Notifications and theme */}
          <div className='flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='relative size-8 cursor-pointer text-muted-foreground'
              aria-label='Notifikasi'
            >
              <Bell className='size-4.5' />

              <span className='absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background' />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='relative size-8 cursor-pointer text-muted-foreground'
                    aria-label='Pilih tema'
                  >
                    <Sun className='size-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute size-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                  </Button>
                }
              />

              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className='size-4' />
                  System
                  {theme === 'system' && (
                    <span className='ml-auto text-xs text-primary'>
                      Aktif
                    </span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className='size-4' />
                  Light
                  {theme === 'light' && (
                    <span className='ml-auto text-xs text-primary'>
                      Aktif
                    </span>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className='size-4' />
                  Dark
                  {theme === 'dark' && (
                    <span className='ml-auto text-xs text-primary'>
                      Aktif
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User information */}
          <div className='flex items-center gap-2.5'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground'>
              {initials || 'U'}
            </div>

            <div className='hidden min-w-0 leading-tight sm:block'>
              <p className='max-w-36 truncate text-sm font-medium text-foreground'>
                {formattedUserName}
              </p>

              <p className='mt-0.5 text-xs capitalize text-muted-foreground'>
                {userRole.toLowerCase()}
              </p>
            </div>
          </div>

          <Separator orientation='vertical' className='h-8' />

          {/* Logout */}
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsLogoutOpen(true)}
            className='size-9 cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive hover:text-white'
            aria-label='Logout'
            title='Logout'
          >
            <LogOut className='size-4' />
          </Button>
        </div>
      </header>

      {/* Logout dialog */}
      <LogoutDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
      />
    </>
  )
}
