import { ApiError, ok, requireApiUser, withApi } from '@/lib/api'
import { createMitraSchema } from '@/modules/monitoring-pulsa/validations/pulsa.validation'
import { createMitraStatistik } from '@/modules/monitoring-pulsa/services/pulsa.service'

export const POST = withApi(async (request) => {
  await requireApiUser(['ADMIN', 'OPERATOR', 'PPK', 'BENDAHARA'])
  const body = await request.json()

  const parsed = createMitraSchema.safeParse(body)
  if (!parsed.success) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      parsed.error.issues[0]?.message ?? 'Data mitra tidak valid.',
    )
  }

  const mitra = await createMitraStatistik(parsed.data)
  return ok(mitra, 201)
})
