
import type { Pegawai } from './pegawai.type'

export type PegawaiResponse = {
  success: boolean
  message: string
  data: Pegawai[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
