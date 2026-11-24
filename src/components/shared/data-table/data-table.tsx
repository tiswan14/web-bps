
'use client'

import {
  useTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { dataTableFeatures } from './data-table.config'

type DataTableColumnMeta = {
  headerClassName?: string
  cellClassName?: string
}

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<typeof dataTableFeatures, TData>[]
  data: TData[]
  emptyMessage?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyMessage = 'Tidak ada data ditemukan',
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
  })

  return (
    <div className='overflow-hidden rounded-lg border'>
      <Table className='w-full table-auto'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className='w-16 text-center'>
                No.
              </TableHead>

              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | DataTableColumnMeta
                  | undefined

                return (
                  <TableHead
                    key={header.id}
                    className={`whitespace-normal ${meta?.headerClassName ?? ''}`}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className='w-16 text-center text-muted-foreground'>
                  {index + 1}
                </TableCell>

                {row.getAllCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | DataTableColumnMeta
                    | undefined

                  return (
                    <TableCell
                      key={cell.id}
                      className={`whitespace-normal wrap-anywhere ${meta?.cellClassName ?? ''}`}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className='h-24 text-center'
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
