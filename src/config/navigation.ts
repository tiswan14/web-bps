
import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Handshake,
  LayoutDashboard,
  UserRound,
  Users,
} from 'lucide-react'

import type { Permission } from '@/lib/auth/permissions'

export type NavigationItem = {
  title: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
  permission?: Permission
}

export type NavigationGroup = {
  title: string
  icon: LucideIcon
  children: NavigationItem[]
}

export const mainNavigation: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    disabled: false,
    permission: 'dashboard.view',
  },
]

export const navigationGroups: NavigationGroup[] = [
  {
    title: 'Data Pegawai',
    icon: Users,
    children: [
      {
        title: 'Organik',
        href: '/pegawai',
        icon: UserRound,
        permission: 'pegawai.manage',
      },
      {
        title: 'Pengelola Anggaran',
        href: '/pegawai/pengelola-anggaran',
        icon: BriefcaseBusiness,
        permission: 'pegawai.manage',
      },
      {
        title: 'Mitra Kepka',
        href: '/kepegawaian/padamel',
        icon: Handshake,
      },
    ],
  },
  {
    title: 'Administrasi',
    icon: BriefcaseBusiness,
    children: [
      {
        title: 'Entri Kegiatan',
        href: '/administrasi/entri-kegiatan',
        icon: ClipboardList,
      },
      {
        title: 'Generate Surat',
        href: '/administrasi/generate-surat',
        icon: FileText,
      },
    ],
  },
]
