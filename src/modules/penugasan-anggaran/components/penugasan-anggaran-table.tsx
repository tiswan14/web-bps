import { DataTable } from '@/components/shared/data-table/data-table'

import type { PenugasanAnggaran } from '../services/penugasan-anggaran.service'
import { getPenugasanAnggaranColumns } from './penugasan-anggaran-columns'

type PenugasanAnggaranTableProps = {
  data: PenugasanAnggaran[]
}

export function PenugasanAnggaranTable({
  data,
}: PenugasanAnggaranTableProps) {
  return (
    <DataTable
      columns={getPenugasanAnggaranColumns()}
      data={data}
      emptyMessage='Belum ada data pengelola anggaran'
    />
  )
}
