
'use client'

import { useState, type FormEvent } from 'react'
import {
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  IdCard,
  LockKeyhole,
  Mail,
  Save,
  User,
  UserRound,
  X,
  LoaderCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import type {
  PegawaiDetail,
  PegawaiPayload,
  CreatePegawaiPayload,
  UpdatePegawaiPayload,
} from '../services/pegawai-mutation.service'

type PegawaiFormProps = {
  initialData?: PegawaiDetail | null
  onCreate: (payload: CreatePegawaiPayload) => Promise<void>
  onUpdate?: (payload: UpdatePegawaiPayload) => Promise<void>
  onCancel: () => void
}

type AccountFields = {
  username: string
  emailAkun: string
  password: string
}

type PegawaiFormState = PegawaiPayload & {
  pendidikan: string
  email: string
  noHp: string
  npwp: string
  rekening: string
  bank: string
  linkSkJabatan: string
  linkSkPangkat: string
  foto: string
  username: string
  emailAkun: string
  password: string
  isActive: boolean
}

const fields = [
  {
    name: 'nama',
    label: 'Nama Lengkap',
    placeholder: 'Masukkan nama lengkap pegawai',
    icon: UserRound,
  },
  {
    name: 'nipLama',
    label: 'NIP Lama',
    placeholder: 'Masukkan NIP lama',
    icon: IdCard,
  },
  {
    name: 'nipBaru',
    label: 'NIP Baru',
    placeholder: 'Masukkan NIP baru',
    icon: IdCard,
  },
  {
    name: 'nik',
    label: 'NIK',
    placeholder: 'Masukkan NIK',
    icon: IdCard,
  },
  {
    name: 'golongan',
    label: 'Golongan',
    placeholder: 'Contoh: III/d',
    icon: BriefcaseBusiness,
  },
  {
    name: 'pangkat',
    label: 'Pangkat',
    placeholder: 'Masukkan pangkat',
    icon: BriefcaseBusiness,
  },
  {
    name: 'jabatan',
    label: 'Jabatan',
    placeholder: 'Masukkan jabatan',
    icon: BriefcaseBusiness,
  },
] as const

const additionalFields = [
  {
    name: 'pendidikan',
    label: 'Pendidikan',
    placeholder: 'Masukkan pendidikan terakhir',
  },
  {
    name: 'email',
    label: 'Email Pegawai',
    placeholder: 'Masukkan email pegawai',
    type: 'email',
  },
  {
    name: 'noHp',
    label: 'Nomor HP',
    placeholder: 'Masukkan nomor HP',
  },
  {
    name: 'npwp',
    label: 'NPWP',
    placeholder: 'Masukkan NPWP',
  },
  {
    name: 'rekening',
    label: 'Nomor Rekening',
    placeholder: 'Masukkan nomor rekening',
  },
  {
    name: 'bank',
    label: 'Nama Bank',
    placeholder: 'Masukkan nama bank',
  },
  {
    name: 'linkSkJabatan',
    label: 'Link SK Jabatan',
    placeholder: 'Masukkan URL SK Jabatan',
  },
  {
    name: 'linkSkPangkat',
    label: 'Link SK Pangkat',
    placeholder: 'Masukkan URL SK Pangkat',
  },
  {
    name: 'foto',
    label: 'URL Foto',
    placeholder: 'Masukkan URL foto pegawai',
  },
] as const

export function PegawaiForm({
  initialData,
  onCreate,
  onUpdate,
  onCancel,
}: PegawaiFormProps) {
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState<PegawaiFormState>(() => ({
    nama: initialData?.nama ?? '',
    nipLama: initialData?.nipLama ?? '',
    nipBaru: initialData?.nipBaru ?? '',
    nik: initialData?.nik ?? '',
    golongan: initialData?.golongan ?? '',
    pangkat: initialData?.pangkat ?? '',
    jabatan: initialData?.jabatan ?? '',
    aktif: initialData?.aktif ?? true,

    pendidikan: initialData?.pendidikan ?? '',
    email: initialData?.email ?? '',
    noHp: initialData?.noHp ?? '',
    npwp: initialData?.npwp ?? '',
    rekening: initialData?.rekening ?? '',
    bank: initialData?.bank ?? '',
    linkSkJabatan: initialData?.linkSkJabatan ?? '',
    linkSkPangkat: initialData?.linkSkPangkat ?? '',
    foto: initialData?.foto ?? '',

    username: initialData?.user?.username ?? '',
    emailAkun: initialData?.user?.email ?? '',
    password: '',
    isActive: initialData?.user?.isActive ?? true,
  }))

  const [account, setAccount] = useState<AccountFields>({
    username: '',
    emailAkun: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (
    field: keyof PegawaiFormState,
    value: string | boolean,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleAccountChange = (
    field: keyof AccountFields,
    value: string,
  ) => {
    setAccount((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      if (isEdit) {
        if (!onUpdate) {
          throw new Error('Fungsi update belum tersedia')
        }

        const payload: UpdatePegawaiPayload = {
          nama: form.nama,
          nipLama: form.nipLama,
          nipBaru: form.nipBaru,
          nik: form.nik,
          golongan: form.golongan,
          pangkat: form.pangkat,
          jabatan: form.jabatan,
          aktif: form.aktif,

          pendidikan: form.pendidikan || null,
          email: form.email || null,
          noHp: form.noHp || null,
          npwp: form.npwp || null,
          rekening: form.rekening || null,
          bank: form.bank || null,
          linkSkJabatan: form.linkSkJabatan || null,
          linkSkPangkat: form.linkSkPangkat || null,
          foto: form.foto || null,
        }

        if (initialData?.user) {
          payload.username = form.username
          payload.emailAkun = form.emailAkun
          payload.isActive = form.isActive

          if (form.password.trim()) {
            payload.password = form.password
          }
        }

        await onUpdate(payload)
        toast.success('Data pegawai berhasil diperbarui')
      } else {
        await onCreate({
          nama: form.nama,
          nipLama: form.nipLama,
          nipBaru: form.nipBaru,
          nik: form.nik,
          golongan: form.golongan,
          pangkat: form.pangkat,
          jabatan: form.jabatan,
          aktif: form.aktif,
          ...account,
        })

        toast.success('Pegawai berhasil ditambahkan')
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan data pegawai',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {!isEdit && (
        <section className='space-y-4'>
          <div className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <UserRound className='size-5' />
            </div>

            <div className='min-w-0'>
              <h3 className='text-sm font-semibold'>
                Akun Pengguna
              </h3>
              <p className='text-xs text-muted-foreground'>
                Buat akun untuk akses sistem pegawai
              </p>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <label htmlFor='username' className='text-sm font-medium'>
                Username
              </label>

              <div className='relative'>
                <User className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='username'
                  className='pl-9'
                  value={account.username}
                  onChange={(event) =>
                    handleAccountChange('username', event.target.value)
                  }
                  placeholder='Masukkan username'
                  autoComplete='username'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='emailAkun' className='text-sm font-medium'>
                Email Akun
              </label>

              <div className='relative'>
                <Mail className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='emailAkun'
                  type='email'
                  className='pl-9'
                  value={account.emailAkun}
                  onChange={(event) =>
                    handleAccountChange('emailAkun', event.target.value)
                  }
                  placeholder='nama@bps.go.id'
                  autoComplete='email'
                  required
                />
              </div>
            </div>

            <div className='space-y-2 sm:col-span-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>

              <div className='relative'>
                <LockKeyhole className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='pl-9 pr-10'
                  value={account.password}
                  onChange={(event) =>
                    handleAccountChange('password', event.target.value)
                  }
                  placeholder='Minimal 8 karakter'
                  autoComplete='new-password'
                  minLength={8}
                  required
                />

                <button
                  type='button'
                  onClick={() => setShowPassword((previous) => !previous)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
                  aria-label={
                    showPassword
                      ? 'Sembunyikan password'
                      : 'Tampilkan password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className='size-4' />
                  ) : (
                    <Eye className='size-4' />
                  )}
                </button>
              </div>

              <p className='text-xs text-muted-foreground'>
                Password harus terdiri dari minimal 8 karakter.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className='space-y-4'>
        <div className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <BriefcaseBusiness className='size-5' />
          </div>

          <div className='min-w-0'>
            <h3 className='text-sm font-semibold'>
              Informasi Pegawai
            </h3>
            <p className='text-xs text-muted-foreground'>
              Lengkapi identitas dan informasi kepegawaian
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {fields.map((field) => {
            const Icon = field.icon

            return (
              <div key={field.name} className='space-y-2'>
                <label
                  htmlFor={field.name}
                  className='text-sm font-medium'
                >
                  {field.label}
                  <span className='ml-1 text-destructive'>*</span>
                </label>

                <div className='relative'>
                  <Icon className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

                  <Input
                    id={field.name}
                    className='pl-9'
                    value={form[field.name]}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className='flex items-center justify-between gap-4 rounded-lg border p-3'>
          <div className='flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-muted'>
              <Check className='size-4 text-muted-foreground' />
            </div>

            <div>
              <p className='text-sm font-medium'>Status Pegawai</p>
              <p className='text-xs text-muted-foreground'>
                Aktif atau nonaktif dalam sistem
              </p>
            </div>
          </div>

          <label className='flex cursor-pointer items-center gap-2 text-sm font-medium'>
            <input
              type='checkbox'
              checked={form.aktif}
              onChange={(event) =>
                handleChange('aktif', event.target.checked)
              }
              className='size-4 accent-primary'
            />
            Aktif
          </label>
        </div>
      </section>

      {isEdit && (
        <>
          <section className='space-y-4'>
            <div className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <IdCard className='size-5' />
              </div>

              <div className='min-w-0'>
                <h3 className='text-sm font-semibold'>
                  Informasi Tambahan
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Informasi administrasi dan data pendukung pegawai
                </p>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              {additionalFields.map((field) => (
                <div key={field.name} className='space-y-2'>
                  <label
                    htmlFor={field.name}
                    className='text-sm font-medium'
                  >
                    {field.label}
                  </label>

                  <Input
                    id={field.name}
                    type={'type' in field ? field.type : 'text'}
                    value={form[field.name]}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </section>

          {initialData?.user && (
            <section className='space-y-4'>
              <div className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <LockKeyhole className='size-5' />
                </div>

                <div className='min-w-0'>
                  <h3 className='text-sm font-semibold'>
                    Informasi Akun
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    Kelola kredensial dan status akun pengguna
                  </p>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label
                    htmlFor='edit-username'
                    className='text-sm font-medium'
                  >
                    Username
                  </label>
                  <Input
                    id='edit-username'
                    value={form.username}
                    onChange={(event) =>
                      handleChange('username', event.target.value)
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='edit-email-akun'
                    className='text-sm font-medium'
                  >
                    Email Akun
                  </label>
                  <Input
                    id='edit-email-akun'
                    type='email'
                    value={form.emailAkun}
                    onChange={(event) =>
                      handleChange('emailAkun', event.target.value)
                    }
                    required
                  />
                </div>

                <div className='space-y-2 sm:col-span-2'>
                  <label
                    htmlFor='edit-password'
                    className='text-sm font-medium'
                  >
                    Password Baru
                  </label>

                  <div className='relative'>
                    <Input
                      id='edit-password'
                      type={showPassword ? 'text' : 'password'}
                      className='pr-10'
                      value={form.password}
                      onChange={(event) =>
                        handleChange('password', event.target.value)
                      }
                      placeholder='Kosongkan jika tidak ingin mengubah password'
                      autoComplete='new-password'
                      minLength={8}
                    />

                    <button
                      type='button'
                      onClick={() => setShowPassword((previous) => !previous)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='size-4' />
                      ) : (
                        <Eye className='size-4' />
                      )}
                    </button>
                  </div>

                  <p className='text-xs text-muted-foreground'>
                    Kosongkan jika password tidak ingin diubah.
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between gap-4 rounded-lg border p-3'>
                <div>
                  <p className='text-sm font-medium'>Status Akun</p>
                  <p className='text-xs text-muted-foreground'>
                    Aktif atau nonaktif untuk akses sistem
                  </p>
                </div>

                <label className='flex cursor-pointer items-center gap-2 text-sm font-medium'>
                  <input
                    type='checkbox'
                    checked={form.isActive}
                    onChange={(event) =>
                      handleChange('isActive', event.target.checked)
                    }
                    className='size-4 accent-primary'
                  />
                  Aktif
                </label>
              </div>
            </section>
          )}
        </>
      )}

      <div className='flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={loading}
        >
          <X className='size-4' />
          Batal
        </Button>

        <Button type='submit' disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle className='size-4 animate-spin' />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className='size-4' />
              {isEdit ? 'Simpan Perubahan' : 'Simpan Pegawai'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
