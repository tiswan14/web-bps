import type { Role } from '@/generated/prisma/client'

export const permissions = [
  'dashboard.view',
  'pegawai.manage',
  'surat.view',
  'surat.create',
  'surat.update',
  'surat.delete',
  'disposisi.view_own',
  'disposisi.create',
  'disposisi.manage',
  'spj.manage',
  'system.manage',
] as const

export type Permission = (typeof permissions)[number]

export const rolePermissions = {
  ADMIN: permissions,
  OPERATOR: permissions,
  PEGAWAI: permissions,
  BENDAHARA: permissions,
  PPK: permissions,
} satisfies Record<Role, readonly Permission[]>

export function hasPermission(
  role: Role,
  permission: Permission,
): boolean {
  const allowedPermissions: readonly Permission[] = rolePermissions[role]

  return allowedPermissions.includes(permission)
}
