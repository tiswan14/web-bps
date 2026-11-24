import { ApiError, ok, requireApiUser, withApi } from '@/lib/api'
import { createAjuanPulsaSchema } from '@/modules/monitoring-pulsa/validations/pulsa.validation'
import {
  createAjuanPulsa,
  getMonitoringPulsaData,
} from '@/modules/monitoring-pulsa/services/pulsa.service'

export const GET = withApi(async (request) => {
  const user = await requireApiUser()
  const now = new Date()

  const bulanParam = Number(request.nextUrl.searchParams.get('bulan'))
  const tahunParam = Number(request.nextUrl.searchParams.get('tahun'))

  const bulan =
    Number.isInteger(bulanParam) && bulanParam >= 1 && bulanParam <= 12
      ? bulanParam
      : now.getMonth() + 1

  const tahun =
    Number.isInteger(tahunParam) && tahunParam >= 2020 && tahunParam <= 2100
      ? tahunParam
      : now.getFullYear()

  const data = await getMonitoringPulsaData({
    bulan,
    tahun,
    userRole: user.role,
  })

  return ok(data)
})

export const POST = withApi(async (request) => {
  const user = await requireApiUser(['ADMIN', 'OPERATOR', 'PPK', 'BENDAHARA'])
  const body = await request.json()

  const parsed = createAjuanPulsaSchema.safeParse(body)
  if (!parsed.success) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      parsed.error.issues[0]?.message ?? 'Input ajuan pulsa tidak valid.',
    )
  }

  const created = await createAjuanPulsa(parsed.data, user.id)
  return ok(
    {
      id: created.id,
      message: 'Ajuan pulsa / paket data berhasil disimpan.',
    },
    201,
  )
})
