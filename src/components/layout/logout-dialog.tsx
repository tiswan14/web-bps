'use client'

import { useFormStatus } from 'react-dom'
import { Info, Loader2, LogOut } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/lib/auth-actions'

type LogoutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function LogoutSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      variant='destructive'
      disabled={pending}
      className='h-10 w-full cursor-pointer gap-2 text-xs'
    >
      {pending ? (
        <Loader2 className='size-4 animate-spin' />
      ) : (
        <LogOut className='size-4' />
      )}
      {pending ? 'Keluar...' : 'Ya, keluar'}
    </Button>
  )
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='w-[calc(100%-2rem)] max-w-lg gap-5 rounded-xl p-7'>
        <AlertDialogHeader className='items-center gap-3 text-center'>
          <div className='flex size-14 items-center justify-center rounded-full bg-destructive/10'>
            <LogOut className='size-7 text-destructive' />
          </div>

          <AlertDialogTitle className='text-lg font-semibold'>
            Keluar dari SIMARLIN?
          </AlertDialogTitle>

          <AlertDialogDescription className='max-w-sm text-xs leading-relaxed'>
            Sesi Anda akan diakhiri dan Anda perlu login kembali untuk
            mengakses sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='rounded-lg border bg-muted/40 p-3'>
          <div className='flex items-center gap-2 text-xs font-semibold'>
            <Info className='size-3.5 text-muted-foreground' />
            Informasi
          </div>

          <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
            Pastikan semua pekerjaan Anda sudah tersimpan sebelum keluar.
          </p>
        </div>

        <AlertDialogFooter className='grid grid-cols-2 gap-3 sm:flex-row'>
          <AlertDialogCancel className='h-10 w-full cursor-pointer text-xs'>
            Batal
          </AlertDialogCancel>

          <form action={logoutAction} className='w-full'>
            <LogoutSubmitButton />
          </form>
        </AlertDialogFooter>

        <p className='text-center text-[11px] text-muted-foreground'>
          Tekan Esc untuk menutup
        </p>
      </AlertDialogContent>
    </AlertDialog>
  )
}
