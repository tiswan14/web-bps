
'use client'

import Image from 'next/image'
import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ExternalLink,
  Fingerprint,
  IdCard,
  Landmark,
  LoaderCircle,
  Phone,
  ShieldCheck,
  ShieldX,
  UserRound,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { getPegawaiById } from '../services/pegawai-mutation.service'

import type { Pegawai } from '../types/pegawai.type'
import type { PegawaiDetail } from '../services/pegawai-mutation.service'

type PegawaiDetailDialogProps = {
  pegawai: Pegawai | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type DetailItemProps = {
  label: string
  value: string | null | undefined
  href?: string | null
  mono?: boolean
}

type DetailSectionProps = {
  title: string
  description?: string
  icon: ComponentType<{ className?: string }>
  children: ReactNode
}

type FetchError = {
  id: string
  message: string
}

function isValidHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function DetailItem({
  label,
  value,
  href,
  mono = false,
}: DetailItemProps) {
  const hasValue = typeof value === 'string' && value.trim().length > 0
  const validHref = hasValue && isValidHttpUrl(href) ? href : null

  return (
    <div className='min-w-0 space-y-1.5'>
      <p className='text-xs font-medium text-muted-foreground'>
        {label}
      </p>

      {hasValue ? (
        validHref ? (
          <a
            href={validHref}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-primary transition-colors hover:underline'
          >
            {value}
            <ExternalLink className='size-3.5 shrink-0' />
          </a>
        ) : (
          <p
            className={`wrap-break-word text-sm font-medium ${mono ? 'font-mono' : ''
              }`}
          >
            {value}
          </p>
        )
      ) : (
        <p className='text-sm italic text-muted-foreground'>
          Belum diisi
        </p>
      )}
    </div>
  )
}

function DetailSection({
  title,
  description,
  icon: Icon,
  children,
}: DetailSectionProps) {
  return (
    <section className='space-y-3'>
      <div className='flex items-center gap-2.5'>
        <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
          <Icon className='size-4' />
        </div>

        <div className='min-w-0'>
          <h3 className='text-sm font-semibold'>{title}</h3>
          {description && (
            <p className='text-xs text-muted-foreground'>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-x-4 gap-y-4 rounded-xl border bg-card p-3.5 sm:grid-cols-2'>
        {children}
      </div>
    </section>
  )
}

function StatusValue({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'
          : 'inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive'
      }
    >
      {active ? (
        <Check className='size-3.5' />
      ) : (
        <ShieldX className='size-3.5' />
      )}
      {active ? 'Aktif' : 'Tidak Aktif'}
    </span>
  )
}

function formatDate(value: string | null | undefined) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getRoleLabel(role: string) {
  const roles: Record<string, string> = {
    ADMIN: 'Administrator',
    OPERATOR: 'Operator',
    PEGAWAI: 'Pegawai',
    BENDAHARA: 'Bendahara',
    PPK: 'Pejabat Pembuat Komitmen',
  }

  return roles[role] ?? role
}

export function PegawaiDetailDialog({
  pegawai,
  open,
  onOpenChange,
}: PegawaiDetailDialogProps) {
  const [detail, setDetail] = useState<PegawaiDetail | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<FetchError | null>(null)

  const pegawaiId = pegawai?.id

  useEffect(() => {
    if (!open || !pegawaiId) return

    let cancelled = false

    const loadData = async () => {
      try {
        const result = await getPegawaiById(pegawaiId)

        if (cancelled) return

        setDetail(result)
        setDetailId(pegawaiId)
        setFetchError(null)
      } catch (error) {
        if (cancelled) return

        setFetchError({
          id: pegawaiId,
          message:
            error instanceof Error
              ? error.message
              : 'Gagal mengambil detail pegawai',
        })
      }
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [open, pegawaiId])

  const currentDetail =
    detailId === pegawaiId ? detail : null

  const currentError =
    fetchError && fetchError.id === pegawaiId
      ? fetchError.message
      : null

  const loading =
    open &&
    Boolean(pegawaiId) &&
    !currentDetail &&
    !currentError

  const user = currentDetail?.user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto p-4 sm:max-w-2xl sm:p-5'>
        <DialogHeader className='space-y-1.5'>
          <DialogTitle className='flex items-center gap-2 text-base'>
            <div className='flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <UserRound className='size-4' />
            </div>
            Detail Pegawai
          </DialogTitle>

          <DialogDescription className='text-xs'>
            Informasi lengkap identitas dan administrasi kepegawaian.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className='flex min-h-48 flex-col items-center justify-center gap-3'>
            <LoaderCircle className='size-7 animate-spin text-primary' />
            <p className='text-sm text-muted-foreground'>
              Memuat detail pegawai...
            </p>
          </div>
        )}

        {currentError && (
          <div className='flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4'>
            <ShieldX className='mt-0.5 size-5 shrink-0 text-destructive' />
            <div className='space-y-1'>
              <p className='text-sm font-semibold text-destructive'>
                Gagal memuat data
              </p>
              <p className='text-sm text-muted-foreground'>
                {currentError}
              </p>
            </div>
          </div>
        )}

        {currentDetail && (
          <div className='space-y-5'>
            {/* Profile Header */}
            <div className='flex items-center gap-3 rounded-xl border bg-muted/20 p-3.5'>
              <div className='flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-primary/10 text-primary'>
                {currentDetail.foto &&
                  isValidHttpUrl(currentDetail.foto) ? (
                  <Image
                    src={currentDetail.foto}
                    alt={`Foto ${currentDetail.nama}`}
                    width={56}
                    height={56}
                    unoptimized
                    className='size-full object-cover'
                  />
                ) : (
                  <UserRound className='size-7' />
                )}
              </div>

              <div className='min-w-0 flex-1 space-y-1'>
                <h3 className='truncate text-sm font-semibold'>
                  {currentDetail.nama}
                </h3>

                <p className='truncate font-mono text-xs text-muted-foreground'>
                  {currentDetail.nipBaru}
                </p>

                <p className='truncate text-xs text-muted-foreground'>
                  {currentDetail.jabatan}
                </p>
              </div>

              <StatusValue active={currentDetail.aktif} />
            </div>

            {/* Identitas */}
            <DetailSection
              title='Identitas Pegawai'
              description='Informasi identitas dan nomor kepegawaian'
              icon={Fingerprint}
            >
              <DetailItem
                label='ID Pegawai'
                value={currentDetail.id}
                mono
              />
              <DetailItem
                label='Nama Lengkap'
                value={currentDetail.nama}
              />
              <DetailItem
                label='NIK'
                value={currentDetail.nik}
                mono
              />
              <DetailItem
                label='NIP Lama'
                value={currentDetail.nipLama}
                mono
              />
              <DetailItem
                label='NIP Baru'
                value={currentDetail.nipBaru}
                mono
              />
            </DetailSection>

            {/* Kepegawaian */}
            <DetailSection
              title='Informasi Kepegawaian'
              description='Jabatan, pangkat, dan pendidikan'
              icon={BriefcaseBusiness}
            >
              <DetailItem
                label='Jabatan'
                value={currentDetail.jabatan}
              />
              <DetailItem
                label='Golongan'
                value={currentDetail.golongan}
              />
              <DetailItem
                label='Pangkat'
                value={currentDetail.pangkat}
              />
              <DetailItem
                label='Pendidikan Terakhir'
                value={currentDetail.pendidikan}
              />
              <div className='space-y-1.5'>
                <p className='text-xs font-medium text-muted-foreground'>
                  Status Pegawai
                </p>
                <StatusValue active={currentDetail.aktif} />
              </div>
            </DetailSection>

            {/* Kontak */}
            <DetailSection
              title='Informasi Kontak'
              description='Alamat komunikasi pegawai'
              icon={Phone}
            >
              <DetailItem
                label='Email Pegawai'
                value={currentDetail.email}
              />
              <DetailItem
                label='Nomor HP'
                value={currentDetail.noHp}
              />
            </DetailSection>

            {/* Administrasi */}
            <DetailSection
              title='Informasi Administrasi'
              description='Informasi perpajakan dan rekening'
              icon={Landmark}
            >
              <DetailItem
                label='NPWP'
                value={currentDetail.npwp}
                mono
              />
              <DetailItem
                label='Nomor Rekening'
                value={currentDetail.rekening}
                mono
              />
              <DetailItem
                label='Nama Bank'
                value={currentDetail.bank}
              />
            </DetailSection>

            {/* Dokumen */}
            <DetailSection
              title='Dokumen Pegawai'
              description='Dokumen pendukung kepegawaian'
              icon={IdCard}
            >
              <DetailItem
                label='Link SK Jabatan'
                value={currentDetail.linkSkJabatan}
                href={currentDetail.linkSkJabatan}
              />
              <DetailItem
                label='Link SK Pangkat'
                value={currentDetail.linkSkPangkat}
                href={currentDetail.linkSkPangkat}
              />
              <DetailItem
                label='URL Foto'
                value={currentDetail.foto}
                href={currentDetail.foto}
              />

              <div className='space-y-1.5'>
                <p className='text-xs font-medium text-muted-foreground'>
                  Preview Foto
                </p>

                {currentDetail.foto &&
                  isValidHttpUrl(currentDetail.foto) ? (
                  <a
                    href={currentDetail.foto}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1.5'
                  >
                    <Image
                      src={currentDetail.foto}
                      alt={`Foto ${currentDetail.nama}`}
                      width={80}
                      height={80}
                      unoptimized
                      className='size-20 rounded-lg border object-cover'
                    />
                    <ArrowUpRight className='size-4 text-muted-foreground' />
                  </a>
                ) : (
                  <p className='text-sm italic text-muted-foreground'>
                    Belum diisi
                  </p>
                )}
              </div>
            </DetailSection>

            {/* Akun */}
            <DetailSection
              title='Informasi Akun'
              description='Akun untuk mengakses sistem'
              icon={ShieldCheck}
            >
              {user ? (
                <>
                  <DetailItem
                    label='ID User'
                    value={user.id}
                    mono
                  />
                  <DetailItem
                    label='Username'
                    value={user.username}
                  />
                  <DetailItem
                    label='Email Akun'
                    value={user.email}
                  />
                  <DetailItem
                    label='Role'
                    value={getRoleLabel(user.role)}
                  />

                  <div className='space-y-1.5'>
                    <p className='text-xs font-medium text-muted-foreground'>
                      Status Akun
                    </p>
                    <StatusValue active={user.isActive} />
                  </div>
                </>
              ) : (
                <div className='sm:col-span-2'>
                  <p className='text-sm text-muted-foreground'>
                    Pegawai belum memiliki akun pengguna.
                  </p>
                </div>
              )}
            </DetailSection>

            {/* Informasi Sistem */}
            <DetailSection
              title='Informasi Sistem'
              description='Riwayat pencatatan data'
              icon={CalendarDays}
            >
              <DetailItem
                label='Tanggal Dibuat'
                value={formatDate(currentDetail.createdAt)}
              />
              <DetailItem
                label='Terakhir Diperbarui'
                value={formatDate(currentDetail.updatedAt)}
              />
            </DetailSection>

            <div className='flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground'>
              <ShieldCheck className='size-3.5 shrink-0' />
              Informasi ditampilkan berdasarkan data pegawai yang tersimpan.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
