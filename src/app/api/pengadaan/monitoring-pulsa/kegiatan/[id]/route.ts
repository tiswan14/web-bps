import { ApiError, ok, requireApiUser, withApi } from '@/lib/api'
import {
  bulkApproveKegiatanSchema,
  updateKegiatanPulsaSchema,
} from '@/modules/monitoring-pulsa/validations/pulsa.validation'
import {
  bulkUpdateStatusKegiatan,
  deleteKegiatanPulsa,
  updateKegiatanPulsa,
} from '@/modules/monitoring-pulsa/services/pulsa.service'

type RouteContext = { params: Promise<{ id: string }> }

export const PATCH = withApi<RouteContext>(async (request, context) => {
  const { id } = await context.params
  const body = await request.json()

  // Mode 1: Bulk approve/reject oleh PPK atau ADMIN
  if ('status' in body && !('namaKegiatan' in body)) {
    const user = await requireApiUser(['ADMIN', 'PPK'])
    const parsedStatus = bulkApproveKegiatanSchema.safeParse(body)
    if (!parsedStatus.success) {
      throw new ApiError(
        400,
        'VALIDATION_ERROR',
        'Status verifikasi kegiatan tidak valid.',
      )
    }
    await bulkUpdateStatusKegiatan(id, parsedStatus.data.status, user.id)
    return ok({ message: 'Status seluruh petugas pada kegiatan berhasil diperbarui.' })
  }

  // Mode 2: Edit rincian kegiatan & daftar petugas
  await requireApiUser(['ADMIN', 'OPERATOR', 'PPK', 'BENDAHARA'])
  const parsed = updateKegiatanPulsaSchema.safeParse(body)
  if (!parsed.success) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      parsed.error.issues[0]?.message ?? 'Input perubahan kegiatan tidak valid.',
    )
  }

  await updateKegiatanPulsa(id, parsed.data)
  return ok({ message: 'Data kegiatan pulsa berhasil diperbarui.' })
})

export const DELETE = withApi<RouteContext>(async (_request, context) => {
  await requireApiUser(['ADMIN', 'OPERATOR', 'PPK', 'BENDAHARA'])
  const { id } = await context.params
  await deleteKegiatanPulsa(id)
  return ok({ message: 'Kegiatan pulsa berhasil dihapus.' })
})
