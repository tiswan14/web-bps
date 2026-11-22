
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileCheck,
  FilePlus,
  FileText,
  FolderOpen,
  Handshake,
  House,
  LayoutDashboard,
  Link,
  Phone,
  Settings,
  ShoppingCart,
  UserRound,
  Users,
  Wrench,
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
    title: 'Beranda',
    href: '/',
    icon: House,
    disabled: false,
  },
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
    title: 'Administrasi',
    icon: BriefcaseBusiness,
    children: [
      {
        title: 'Sigap SPJ',
        href: '/administrasi/sigap-spj',
        icon: FileText,
        permission: 'spj.manage',
      },
      {
        title: 'SPK dan BAST',
        href: '/administrasi/spk-bast',
        icon: FileCheck,
      },
      {
        title: 'Kecap to Bendahara',
        href: '/administrasi/kecap-bendahara',
        icon: ClipboardList,
      },
      {
        title: 'Lapor Supervisi',
        href: '/administrasi/lapor-supervisi',
        icon: ClipboardCheck,
      },
      {
        title: 'Blok Tanggal Translok',
        href: '/administrasi/translok',
        icon: CalendarDays,
      },
    ],
  },
  {
    title: 'Pengadaan',
    icon: ShoppingCart,
    children: [
      {
        title: 'Usul Pengadaan',
        href: '/pengadaan/usul',
        icon: ShoppingCart,
      },
      {
        title: 'Monitoring Pulsa Bulanan',
        href: '/pengadaan/monitoring-pulsa',
        icon: Phone,
      },
    ],
  },
  {
    title: 'Kepegawaian',
    icon: Users,
    children: [
      {
        title: 'KarierKu',
        href: '/kepegawaian/karierku',
        icon: Activity,
      },
      {
        title: 'Padamel | Mitra Kepka',
        href: '/kepegawaian/padamel',
        icon: Handshake,
      },
      {
        title: 'Data Pegawai',
        href: '/pegawai',
        icon: UserRound,
        permission: 'pegawai.manage',
      },
    ],
  },
  {
    title: 'Umum',
    icon: Building2,
    children: [
      {
        title: 'Book Aula',
        href: '/umum/book-aula',
        icon: CalendarDays,
      },
      {
        title: 'Surat & Disposisi',
        href: '/surat',
        icon: FileText,
        permission: 'surat.view',
      },
    ],
  },
  {
    title: 'Teknis',
    icon: Wrench,
    children: [
      {
        title: 'Kalender Kerja',
        href: '/teknis/kalender-kerja',
        icon: CalendarDays,
      },
      {
        title: 'Plotting Mitra',
        href: '/teknis/plotting-mitra',
        icon: Users,
      },
      {
        title: 'SE 2026',
        href: '/teknis/se-2026',
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: 'Petugas',
    icon: ClipboardCheck,
    children: [
      {
        title: 'Pelatihan',
        href: '/petugas/pelatihan',
        icon: BookOpen,
      },
      {
        title: 'Monitoring Lapangan',
        href: '/petugas/monitoring-lapangan',
        icon: Activity,
      },
    ],
  },
  {
    title: 'Kualitas Data',
    icon: ChartNoAxesCombined,
    children: [
      {
        title: 'Aset/Kepemilikan',
        href: '/kualitas-data/aset',
        icon: Building2,
      },
      {
        title: 'Pendapatan/Pengeluaran',
        href: '/kualitas-data/pendapatan',
        icon: ChartNoAxesCombined,
      },
      {
        title: 'Pekerjaan',
        href: '/kualitas-data/pekerjaan',
        icon: BriefcaseBusiness,
      },
      {
        title: 'Perumahan',
        href: '/kualitas-data/perumahan',
        icon: House,
      },
      {
        title: 'Cek Infrastruktur',
        href: '/kualitas-data/infrastruktur',
        icon: Wrench,
      },
      {
        title: 'Nilai Tambah Bruto',
        href: '/kualitas-data/ntb',
        icon: ChartNoAxesCombined,
      },
      {
        title: 'Olah Cepat Makro',
        href: '/kualitas-data/olah-makro',
        icon: Activity,
      },
      {
        title: 'Verifikasi Akhir',
        href: '/kualitas-data/verifikasi',
        icon: FileCheck,
      },
    ],
  },
  {
    title: 'Rekrutmen',
    icon: Users,
    children: [
      {
        title: 'Mitra 2026 Tambahan',
        href: '/rekrutmen/mitra-tambahan',
        icon: UserRound,
      },
      {
        title: 'Mitra SE2026',
        href: '/rekrutmen/mitra-se2026',
        icon: Users,
      },
    ],
  },
  {
    title: 'Dokumen',
    icon: FolderOpen,
    children: [
      {
        title: 'e-Dokumen',
        href: '/dokumen',
        icon: FolderOpen,
      },
      {
        title: 'Buat e-Dokumen',
        href: '/dokumen/buat',
        icon: FilePlus,
      },
      {
        title: 'Download e-Dokumen',
        href: '/dokumen/download',
        icon: Download,
      },
    ],
  },
  {
    title: 'Utilitas & Admin',
    icon: Settings,
    children: [
      {
        title: 'Sikostik 28',
        href: '/utilitas/sikostik',
        icon: Settings,
      },
      {
        title: 'Linkers',
        href: '/utilitas/linkers',
        icon: Link,
      },
      {
        title: 'Pedoman',
        href: '/utilitas/pedoman',
        icon: BookOpen,
      },
    ],
  },
]
