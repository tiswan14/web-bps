import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function SidebarBrand() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip="Web BPS Kabupaten Pangandaran"
            render={<Link href="/dashboard" />}
            className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="size-5" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold">WEB BPS</span>
              <span className="truncate text-xs text-muted-foreground">
                Kabupaten Pangandaran
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
