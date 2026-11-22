
import { requireUser } from '@/lib/auth'
import { rolePermissions } from '@/lib/auth/permissions'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await requireUser()
  const userName = user.pegawai?.nama ?? user.username
  const permissions = rolePermissions[user.role]

  return (
    <SidebarProvider>
      <AppSidebar permissions={permissions} />

      <SidebarInset>
        <AppHeader
          userName={userName}
          userRole={user.role}
        />

        <main className="flex min-h-0 flex-1 flex-col gap-6 bg-background p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
