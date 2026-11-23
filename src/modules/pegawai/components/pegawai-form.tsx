'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  AlertCircle,
  Award,
  BadgeCheck,
  Briefcase,
  Hash,
  Layers,
  Loader2,
  Mail,
  Save,
  User,
  X,
} from 'lucide-react'
import { createPegawai } from '../services/pegawai.service'
import { createPegawaiSchema } from '../validations/pegawai.schema'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormInput = z.input<typeof createPegawaiSchema>
type FormOutput = z.output<typeof createPegawaiSchema>

interface PegawaiFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const sections = [
  {
    title: 'Identitas',
    description: 'Data diri pegawai.',
    fields: [
      {
        name: 'nama',
        label: 'Nama Lengkap',
        placeholder: 'Masukkan nama lengkap',
        icon: User,
        required: true,
        fullWidth: true,
      },
      {
        name: 'nip',
        label: 'NIP',
        placeholder: 'Masukkan NIP',
        icon: Hash,
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        placeholder: 'nama@email.com',
        icon: Mail,
      },
    ],
  },
  {
    title: 'Kepegawaian',
    description: 'Informasi pangkat, golongan, dan jabatan.',
    fields: [
      {
        name: 'nipBps',
        label: 'NIP BPS',
        placeholder: 'Masukkan NIP BPS',
        icon: BadgeCheck,
      },
      {
        name: 'golonganAkhir',
        label: 'Golongan Akhir',
        placeholder: 'Contoh: III/a',
        icon: Layers,
      },
      {
        name: 'pangkat',
        label: 'Pangkat',
        placeholder: 'Masukkan pangkat',
        icon: Award,
      },
      {
        name: 'jabatan',
        label: 'Jabatan',
        placeholder: 'Masukkan jabatan',
        icon: Briefcase,
      },
    ],
  },
] as const

export function PegawaiForm({ onSuccess, onCancel }: PegawaiFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(createPegawaiSchema),
    defaultValues: {
      nama: '',
      nip: '',
      email: '',
      nipBps: '',
      golonganAkhir: '',
      pangkat: '',
      jabatan: '',
      fungsiId: '',
    },
  })

  const onSubmit = async (data: FormOutput) => {
    try {
      setServerError(null)

      await createPegawai(data)
      onSuccess()
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan data pegawai',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          {/* Judul section */}
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold tracking-tight">
                {section.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {section.description}
              </p>
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Field */}
          <div className="grid gap-5 sm:grid-cols-2">
            {section.fields.map((field) => {
              const Icon = field.icon
              const error = errors[field.name]
              const isFullWidth = 'fullWidth' in field && field.fullWidth

              return (
                <div
                  key={field.name}
                  className={
                    isFullWidth
                      ? 'space-y-2 sm:col-span-2'
                      : 'space-y-2'
                  }
                >
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none"
                  >
                    {field.label}
                    {'required' in field && field.required && (
                      <span className="text-destructive"> *</span>
                    )}
                  </label>

                  <div className="group relative">
                    <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id={field.name}
                      placeholder={field.placeholder}
                      disabled={isSubmitting}
                      aria-invalid={!!error}
                      className="h-10 pl-9"
                      {...register(field.name)}
                    />
                  </div>

                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="size-3.5 shrink-0" />
                      {error.message}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {/* Error dari server */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Aksi */}
      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer gap-2 disabled:cursor-not-allowed"
        >
          <X className="size-4" />
          Batal
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group cursor-pointer gap-2 shadow-sm shadow-primary/20 transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-4 transition-transform group-hover:scale-110" />
              Simpan Pegawai
            </>
          )}
        </Button>
      </div>
    </form>
  )
}