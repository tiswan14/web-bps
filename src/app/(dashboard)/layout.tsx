import { requireUser } from "@/lib/auth";
import { rolePermissions } from "@/lib/auth/permissions";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await requireUser();
  const userName = user.pegawai?.nama ?? user.username;
  const permissions = rolePermissions[user.role];

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar permissions={permissions} />

      <SidebarInset className="min-h-0 overflow-y-auto md:m-0 md:rounded-none md:shadow-none">
        <AppHeader userName={userName} userRole={user.role} />

        <main className="flex min-h-0 flex-1 flex-col gap-6 bg-background px-2 py-3 md:px-3 md:py-4">
          {children}
          <div>
            <h1>halo baroo</h1>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
