import { LogOut, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { logoutAction } from '@/lib/auth-actions'

type AppHeaderProps = {
  userName: string
  userRole: string
}

export function AppHeader({ userName, userRole }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4">
      <div className="flex min-w-0 items-center gap-3">

        <Separator orientation="vertical" className="h-5" />

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
            Dashboard
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            BPS Kabupaten Pangandaran
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className=" ml-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserRound size={21} />
        </div>

        <div className="hidden text-left sm:block">
          <p className="max-w-40 truncate text-sm font-semibold text-foreground">
            {userName
              .replaceAll('_', ' ')
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>
          <p className="text-xs capitalize text-muted-foreground">
            {userRole.toLowerCase()}
          </p>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="h-9 cursor-pointer gap-2 border-destructive/40 px-3 text-sm text-destructive hover:border-destructive hover:bg-destructive hover:text-white"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
