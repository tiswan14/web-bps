import Link from 'next/link'
import {
  ArrowLeft,
  Clock3,
  Construction,
  Sparkles,
} from 'lucide-react'

type UnderDevelopmentProps = {
  title?: string
  description?: string
}

export function UnderDevelopment({
  title = 'Fitur Sedang Dikembangkan',
  description = 'Kami sedang mempersiapkan fitur ini agar dapat memberikan pengalaman kerja yang lebih efektif, terintegrasi, dan efisien bagi BPS Kabupaten Pangandaran.',
}: UnderDevelopmentProps) {
  return (
    <section className="flex h-[calc(100dvh-8rem)] items-center justify-center overflow-hidden px-6 py-4">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <div className="relative mb-7">
          <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 sm:size-28">
            <Construction
              className="size-12 text-primary sm:size-14"
              strokeWidth={1.5}
            />
          </div>

          <div className="absolute -right-2 -top-1 flex size-9 items-center justify-center rounded-full bg-background text-primary shadow-sm">
            <Sparkles className="size-5" />
          </div>
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Dalam Pengembangan
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>

        <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="size-4 text-primary" />
          <span>Fitur sedang dalam proses pengerjaan</span>
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Dashboard
        </Link>

        <p className="mt-8 text-xs text-muted-foreground">
          WEB BPS Kabupaten Pangandaran
        </p>
      </div>
    </section>
  )
}
