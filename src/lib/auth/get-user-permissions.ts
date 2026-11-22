import 'server-only'
import { requireUser } from '@/lib/auth'
import { rolePermissions } from '@/lib/auth/permissions'

export async function getUserPermissions() {
  const user = await requireUser()

  return {
    user,
    permissions: rolePermissions[user.role],
  }
}
