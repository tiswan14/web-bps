import { ApiError, ok, requireApiUser, withApi } from '@/lib/api'
import { verifikasiAlokasiSchema } from '@/modules/monitoring-pulsa/validations/pulsa.validation'
import { verifikasiAlokasiPulsa } from '@/modules/monitoring-pulsa/services/pulsa.service'

type RouteContext = { params: Promise<{ id: string }> }

export const PATCH = withApi<RouteContext>(async (request, context) => {
  const user = await requireApiUser(['ADMIN', 'PPK'])
  const { id } = await context.params
  const body = await request.json()

  const parsed = verifikasiAlokasiSchema.safeParse(body)
  if (!parsed.success) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      parsed.error.issues[0]?.message ?? 'Status persetujuan tidak valid.',
    )
  }

  await verifikasiAlokasiPulsa({
    alokasiId: id,
    status: parsed.data.status,
    catatanVerifikasi: parsed.data.catatanVerifikasi,
    verifikatorId: user.id,
  })

  return ok({ message: 'Status persetujuan PPK berhasil diperbarui.' })
})
