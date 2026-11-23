export type JenisSurat = 'MASUK' | 'KELUAR'

export type SifatSurat = 'BIASA' | 'PENTING'

export interface SuratItem {
    id: string
    jenis: JenisSurat
    nomor: string
    tanggal: string
    asalTujuan: string
    perihal: string
    sifat: SifatSurat
    pengantaran: string | null
    status: string | null
    periodeId?: number
    penerimaDisposisi?: string | null
    dicatatOleh: string
}

export interface CreateSuratInput {
    jenis: JenisSurat
    nomor: string
    tanggal: string
    asalTujuan: string
    perihal: string
    sifat: SifatSurat
    pengantaran: string | null
    status: string | null
    periodeId: number
}

export type UpdateSuratInput = Partial<CreateSuratInput>

export interface SuratApiRecord {
    id: string
    jenis: JenisSurat
    nomor: string
    tanggal: string
    asalTujuan: string
    perihal: string
    sifat: SifatSurat
    pengantaran: string | null
    status: string | null
    dicatatOleh: string
    periodeId: number
    pencatat?: {
        id: string
        username: string
        email: string
    } | null
}

export interface SuratListResponse {
    success: boolean
    message: string
    data: {
        data: SuratApiRecord[]
        meta: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
}

export interface SuratMutationResponse {
    success: boolean
    message: string
    data: SuratApiRecord
}