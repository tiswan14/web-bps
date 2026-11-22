import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  className?: string
}

export function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <main className={`space-y-6 p-4 md:p-6 ${className ?? ''}`}>
      {children}
    </main>
  )
}
