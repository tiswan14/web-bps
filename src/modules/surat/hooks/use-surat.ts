
'use client'

import { useCallback, useEffect, useState } from 'react'

import {
    deleteSuratById,
    fetchSuratList,
    patchUpdateSurat,
    postCreateSurat,
} from '../services/surat-api.service'

import type {
    CreateSuratInput,
    JenisSurat,
    SuratItem,
    UpdateSuratInput,
} from '../types'

interface UseSuratParams {
    page: number
    limit: number
    search?: string
    jenis?: JenisSurat
}

interface SuratPagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

const initialPagination: SuratPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
}

export function useSurat({
    page,
    limit,
    search,
    jenis,
}: UseSuratParams) {
    const [data, setData] = useState<SuratItem[]>([])
    const [pagination, setPagination] =
        useState<SuratPagination>(initialPagination)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const result = await fetchSuratList({
                page,
                limit,
                search,
                jenis,
            })

            setData(result.items)
            setPagination(result.meta)
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Gagal memuat data surat',
            )
        } finally {
            setLoading(false)
        }
    }, [page, limit, search, jenis])

    const createSurat = useCallback(
        async (payload: CreateSuratInput) => {
            return postCreateSurat(payload)
        },
        [],
    )

    const updateSurat = useCallback(
        async (id: string, payload: UpdateSuratInput) => {
            return patchUpdateSurat(id, payload)
        },
        [],
    )

    const deleteSurat = useCallback(async (id: string) => {
        return deleteSuratById(id)
    }, [])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return {
        data,
        pagination,
        loading,
        error,
        refresh,
        createSurat,
        updateSurat,
        deleteSurat,
    }
}
