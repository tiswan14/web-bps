import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ActionButtonsProps {
  onDetail?: () => void
  onEdit?: () => void
  onDelete?: () => void
  deleteLabel?: string
}

export function ActionButtons({
  onDetail,
  onEdit,
  onDelete,
  deleteLabel = 'Hapus',
}: ActionButtonsProps) {
  return (
    <div className='mx-auto flex w-fit items-center justify-center gap-1'>
      {onDetail && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 cursor-pointer'
          aria-label='Detail'
          title='Detail'
          onClick={onDetail}
        >
          <Eye className='size-4' />
        </Button>
      )}

      {onEdit && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 cursor-pointer'
          aria-label='Edit'
          title='Edit'
          onClick={onEdit}
        >
          <Pencil className='size-4' />
        </Button>
      )}

      {onDelete && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 cursor-pointer text-destructive hover:text-destructive'
          aria-label={deleteLabel}
          title={deleteLabel}
          onClick={onDelete}
        >
          <Trash2 className='size-4' />
        </Button>
      )}
    </div>
  )
}
