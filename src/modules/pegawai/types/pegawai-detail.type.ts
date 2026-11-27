import type { Pegawai } from './pegawai.type'

export type PegawaiDetail = Pegawai & {
  pendidikan: string | null
  email: string | null
  noHp: string | null
  npwp: string | null
  rekening: string | null
  bank: string | null
  linkSkJabatan: string | null
  linkSkPangkat: string | null
  foto: string | null
  user: {
    id: string
    username: string
    email: string
    role: 'ADMIN' | 'OPERATOR' | 'PEGAWAI' | 'BENDAHARA' | 'PPK'
    isActive: boolean
  } | null
}
