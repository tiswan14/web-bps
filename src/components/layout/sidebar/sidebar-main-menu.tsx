'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { mainNavigation } from '@/config/navigation'

export function SidebarMainMenu() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {mainNavigation.map((item) => {
            const Icon = item.icon

            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  disabled={item.disabled}
                  tooltip={item.title}
                  render={
                    item.disabled ? undefined : <Link href={item.href} />
                  }
                  className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {Icon && <Icon className="size-4" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
