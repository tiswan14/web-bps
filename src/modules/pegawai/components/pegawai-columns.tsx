
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { DataTableFeatures } from '@/components/shared/data-table/data-table.config'
import type { Pegawai } from '../types/pegawai.type'

export function getPegawaiColumns(
  showFungsi: boolean,
): ColumnDef<DataTableFeatures, Pegawai>[] {
  return [
    {
      accessorKey: 'nama',
      header: 'Nama Pegawai',
      meta: {
        headerClassName: 'w-48 pl-3',
        cellClassName: 'w-48 min-w-48 px-3',
      },
      cell: ({ row }) => {
        const nama = row.original.nama

        const initials = nama
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((word) => word[0])
          .join('')
          .toUpperCase()

        return (
          <div className='flex items-center gap-3'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
              {initials}
            </div>

            <div className='flex min-w-0 flex-col gap-0.5'>
              <span className='truncate font-medium'>{nama}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'nip',
      header: 'NIP',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.email ?? '-',
    },
    {
      accessorKey: 'nipBps',
      header: 'NIP BPS',
      cell: ({ row }) => row.original.nipBps ?? '-',
    },
    {
      accessorKey: 'golonganAkhir',
      header: 'Golongan',
      cell: ({ row }) => row.original.golonganAkhir ?? '-',
    },
    {
      accessorKey: 'pangkat',
      header: 'Pangkat',
      cell: ({ row }) => row.original.pangkat ?? '-',
    },
    {
      accessorKey: 'jabatan',
      header: 'Jabatan',
      cell: ({ row }) => row.original.jabatan ?? '-',
    },
    ...(showFungsi
      ? [
        {
          accessorKey: 'fungsi',
          header: 'Fungsi',
          cell: ({ row }) => row.original.fungsi?.nama ?? '-',
        } satisfies ColumnDef<DataTableFeatures, Pegawai>,
      ]
      : []),
    {
      id: 'aksi',
      header: 'Aksi',
      meta: {
        headerClassName: 'pl-8',
      },
      cell: ({ row }) => {
        const pegawai = row.original

        return (
          <div className='flex items-center justify-end gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 cursor-pointer'
              aria-label={`Detail ${pegawai.nama}`}
              title='Detail'
            >
              <Eye className='size-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='size-8 cursor-pointer'
              aria-label={`Edit ${pegawai.nama}`}
              title='Edit'
            >
              <Pencil className='size-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='size-8 cursor-pointer text-destructive hover:text-destructive'
              aria-label={`Hapus ${pegawai.nama}`}
              title='Hapus'
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        )
      },
    },
  ]
}
