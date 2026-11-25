import type { ColumnDef } from '@tanstack/react-table'

import type { DataTableFeatures } from '@/components/shared/data-table/data-table.config'
import type { PenugasanAnggaran } from '../services/penugasan-anggaran.service'

const jenisPenugasanLabel: Record<PenugasanAnggaran['jenis'], string> = {
  KUASA_PENGGUNA_ANGGARAN: 'Kuasa Pengguna Anggaran',
  PEJABAT_PENANDATANGAN_SURAT_PERINTAH_MEMBAYAR: 'Pejabat Penandatangan SPM',
  PEJABAT_PEMBUAT_KOMITMEN: 'Pejabat Pembuat Komitmen',
  PEJABAT_PENGADAAN_BARANG_DAN_JASA: 'Pejabat Pengadaan Barang dan Jasa',
  BENDAHARA_PENGELUARAN: 'Bendahara Pengeluaran',
}

export function getPenugasanAnggaranColumns(): ColumnDef<
  DataTableFeatures,
  PenugasanAnggaran
>[] {
  return [
    {
      id: 'nama',
      header: 'Nama',
      accessorFn: (row) => row.pegawai.nama,
      meta: {
        headerClassName: 'w-64 pl-3',
        cellClassName: 'w-64 min-w-64 px-3',
      },
      cell: ({ row }) => {
        const nama = row.original.pegawai.nama

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

            <span className='truncate font-medium'>{nama}</span>
          </div>
        )
      },
    },
    {
      id: 'nip',
      header: 'NIP',
      accessorFn: (row) => row.pegawai.nip,
    },
    {
      id: 'nipBos',
      header: 'NIP BPS',
      accessorFn: (row) => row.pegawai.nipBps,
    },
    {
      id: 'jabatan',
      header: 'Jabatan',
      accessorFn: (row) => jenisPenugasanLabel[row.jenis],
      cell: ({ row }) => jenisPenugasanLabel[row.original.jenis],
    },
  ]
}
