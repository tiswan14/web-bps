
import { describe, expect, it } from 'vitest'
import {
  hasPermission,
  permissions,
  rolePermissions,
} from '@/lib/auth/permissions'

describe('hasPermission', () => {
  it('should allow ADMIN to access all permissions', () => {
    for (const permission of permissions) {
      expect(hasPermission('ADMIN', permission)).toBe(true)
    }
  })

  it('should allow configured permissions for every role', () => {
    const roles = Object.keys(rolePermissions) as Array<
      keyof typeof rolePermissions
    >

    for (const role of roles) {
      const allowedPermissions = rolePermissions[role]

      for (const permission of allowedPermissions) {
        expect(hasPermission(role, permission)).toBe(true)
      }
    }
  })

  it('should return false for an undefined permission', () => {
    expect(
      hasPermission('ADMIN', 'unknown.permission' as never),
    ).toBe(false)
  })
})
