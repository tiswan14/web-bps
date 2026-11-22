
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar'
import { navigationGroups } from '@/config/navigation'
import { SidebarBrand } from './sidebar/sidebar-brand'
import { SidebarFooter } from './sidebar/sidebar-footer'
import { SidebarMainMenu } from './sidebar/sidebar-main-menu'
import { SidebarNavigationGroup } from './sidebar/sidebar-navigation-group'
import type { Permission } from '@/lib/auth/permissions'

type AppSidebarProps = {
  permissions: readonly Permission[]
}

export function AppSidebar({ permissions }: AppSidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>([])
  function toggleGroup(title: string) {
    setOpenGroups((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    )
  }

  const filteredGroups = navigationGroups
    .map((group) => ({
      ...group,
      children: group.children.filter((item) => {
        if (!item.permission) return true

        return permissions.includes(item.permission)
      }),
    }))
    .filter((group) => group.children.length > 0)



  return (
    <Sidebar
      collapsible='none'
      variant='inset'
      className='h-full overflow-hidden'
    >
      <SidebarBrand />

      <SidebarContent className='min-h-0 flex-1 overflow-y-auto'>
        <SidebarMainMenu />

        {filteredGroups.map((group) => (
          <SidebarNavigationGroup
            key={group.title}
            group={group}
            pathname={pathname}
            isOpen={openGroups.includes(group.title)}
            onToggle={toggleGroup}
          />
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
