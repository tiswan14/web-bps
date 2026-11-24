
import type { ColumnDef } from '@tanstack/react-table'

import type { DataTableFeatures } from '@/components/shared/data-table/data-table.config'

import type { Pegawai } from '../types/pegawai.type'

import { ActionButtons } from '@/components/shared/action-buttons'

interface PegawaiColumnActions {
  onDetail?: (pegawai: Pegawai) => void
  onEdit?: (pegawai: Pegawai) => void
  onDelete?: (pegawai: Pegawai) => void
}

export function getPegawaiColumns(
  showFungsi: boolean,
  actions: PegawaiColumnActions = {},
): ColumnDef<DataTableFeatures, Pegawai>[] {
  return [
    {
      accessorKey: 'nama',
      header: 'Nama Pegawai',
      meta: {
        headerClassName: 'w-[220px]',
        cellClassName: 'w-[220px]',
      },
    },

    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className='truncate'>
          {row.original.email ?? '-'}
        </span>
      ),
    },
    
    {
      accessorKey: 'nip',
      header: 'NIP',
      meta: {
        headerClassName: 'w-[190px]',
        cellClassName: 'w-[190px]',
      },
    },
    {
      accessorKey: 'nipBps',
      header: 'NIP BPS',
      meta: {
        headerClassName: 'w-[130px]',
        cellClassName: 'w-[130px]',
      },
    },
    {
      accessorKey: 'jabatan',
      header: 'Jabatan',
      meta: {
        headerClassName: 'w-[220px]',
        cellClassName: 'w-[220px]',
      },
    },
    {
      accessorKey: 'golonganAkhir',
      header: 'Golongan',
      meta: {
        headerClassName: 'w-[120px]',
        cellClassName: 'w-[120px]',
      },
    },
    ...(showFungsi
      ? [
        {
          id: 'fungsi',
          accessorFn: (row) => row.fungsi?.nama ?? '-',
          header: 'Fungsi',
        } satisfies ColumnDef<DataTableFeatures, Pegawai>,
      ]
      : []),
    {
      accessorKey: 'aktif',
      header: 'Status',
      cell: ({ row }) => {
        const aktif = row.original.aktif

        return (
          <span
            className={
              aktif
                ? 'inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'
                : 'inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
            }
          >
            {aktif ? 'Aktif' : 'Nonaktif'}
          </span>
        )
      },
    },
    {
      id: 'aksi',
      header: 'Aksi',
      meta: {
        headerClassName: 'w-px whitespace-nowrap text-center',
        cellClassName: 'w-px whitespace-nowrap',
      },
      cell: ({ row }) => {
        const pegawai = row.original

        return (
          <ActionButtons
            onDetail={() => actions.onDetail?.(pegawai)}
            onEdit={() => actions.onEdit?.(pegawai)}
            onDelete={() => actions.onDelete?.(pegawai)}
          />
        )
      },
    },
  ]
}
