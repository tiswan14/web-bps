
'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import type { NavigationGroup } from '@/config/navigation'

type SidebarNavigationGroupProps = {
  group: NavigationGroup
  pathname: string
  isOpen: boolean
  onToggle: (title: string) => void
}

export function SidebarNavigationGroup({
  group,
  pathname,
  isOpen,
  onToggle,
}: SidebarNavigationGroupProps) {
  const Icon = group.icon

  const hasActiveChild = group.children.some(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`),
  )

  const isExpanded = isOpen || hasActiveChild

  return (
    <SidebarGroup className='py-1'>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={group.title}
              aria-expanded={isExpanded}
              onClick={() => onToggle(group.title)}
              className={`cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground ${hasActiveChild ? 'font-semibold text-primary' : ''
                }`}
            >
              <Icon className='size-4' />
              <span className='flex-1'>{group.title}</span>

              <ChevronDown
                className={`size-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                  }`}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isExpanded && (
            <div className='flex flex-col gap-1 pb-3 group-data-[collapsible=icon]:hidden'>
              {group.children.map((item) => {
                const ItemIcon = item.icon

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      disabled={item.disabled ?? false}
                      tooltip={item.title}
                      render={
                        item.disabled
                          ? undefined
                          : <Link href={item.href} />
                      }
                      className={`cursor-pointer pl-9 transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? 'font-medium' : ''
                        }`}
                    >
                      {ItemIcon && (
                        <ItemIcon className='size-4 shrink-0' />
                      )}

                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
