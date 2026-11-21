import { ok, requireApiUser, withApi } from '@/lib/api'

export const GET = withApi(async () => {
  const user = await requireApiUser()
  return ok(user)
})
