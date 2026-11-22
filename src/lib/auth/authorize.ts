import { requireUser } from '@/lib/auth'
import {
  hasPermission,
  type Permission,
} from '@/lib/auth/permissions'

export class ForbiddenError extends Error {
  readonly status = 403

  constructor(message = 'Kamu tidak memiliki akses untuk tindakan ini') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser()

  if (!hasPermission(user.role, permission)) {
    throw new ForbiddenError()
  }

  return user
}
