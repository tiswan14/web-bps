import { DataTable } from '@/components/shared/data-table/data-table'

import type { Pegawai } from '../types/pegawai.type'
import { getPegawaiColumns } from './pegawai-columns'

type PegawaiTableProps = {
  data: Pegawai[]
  showFungsi?: boolean
}

export function PegawaiTable({
  data,
  showFungsi = false,
}: PegawaiTableProps) {
  return (
    <DataTable
      columns={getPegawaiColumns(showFungsi)}
      data={data}
      emptyMessage='Belum ada data pegawai'
    />
  )
}
