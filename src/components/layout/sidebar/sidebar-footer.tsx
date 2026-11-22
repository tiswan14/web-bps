import { Database } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  SidebarFooter as SidebarFooterContainer,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function SidebarFooter() {
  return (
    <SidebarFooterContainer className="mt-auto">
      <Separator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="BPS Kabupaten Pangandaran"
            className="cursor-default"
          >
            <Database className="size-4" />
            <span className="truncate text-xs">
              BPS Kabupaten Pangandaran
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooterContainer>
  )
}