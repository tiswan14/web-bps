
import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import type { DataTableFeatures } from '@/components/shared/data-table/data-table.config'

import type { Pegawai } from '../types/pegawai.type'

type PegawaiColumnActions = {
  onDetail: (pegawai: Pegawai) => void
  onEdit: (pegawai: Pegawai) => void
  onDelete: (pegawai: Pegawai) => void
  page: number
  limit: number
}

export function getPegawaiColumns({
  onDetail,
  onEdit,
  onDelete,
  page,
  limit,
}: PegawaiColumnActions): ColumnDef<DataTableFeatures, Pegawai>[] {
  return [
    {
      id: 'no',
      header: 'No.',
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
      meta: {
        headerClassName: 'w-14 min-w-14 text-center',
        cellClassName: 'text-center tabular-nums',
      },
    },
    {
      accessorKey: 'nama',
      header: 'Nama Pegawai',
      meta: {
        headerClassName: 'min-w-48',
      },
    },
    {
      accessorKey: 'nipLama',
      header: 'NIP Lama',
      meta: {
        headerClassName: 'min-w-32',
      },
    },
    {
      accessorKey: 'nipBaru',
      header: 'NIP Baru',
      meta: {
        headerClassName: 'min-w-40',
      },
    },
    {
      accessorKey: 'golongan',
      header: 'Golongan',
    },
    {
      accessorKey: 'pangkat',
      header: 'Pangkat',
      meta: {
        headerClassName: 'min-w-40',
      },
    },
    {
      accessorKey: 'jabatan',
      header: 'Jabatan',
      meta: {
        headerClassName: 'min-w-48',
      },
    },
    {
      id: 'aksi',
      header: 'Aksi',
      meta: {
        headerClassName: 'min-w-36 text-center',
        cellClassName: 'text-center',
      },
      cell: ({ row }) => {
        const pegawai = row.original

        return (
          <div className='flex items-center justify-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              title='Detail pegawai'
              onClick={() => onDetail(pegawai)}
            >
              <Eye className='size-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              title='Edit pegawai'
              onClick={() => onEdit(pegawai)}
            >
              <Pencil className='size-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-destructive hover:text-destructive'
              title='Hapus pegawai'
              onClick={() => onDelete(pegawai)}
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        )
      },
    },
  ]
}
