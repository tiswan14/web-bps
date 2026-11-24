import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import {
    deleteDisposisiById,
    fetchDisposisiList,
    patchUpdateDisposisi,
    postCreateDisposisi,
} from '@/modules/disposisi/services/disposisi-api.service'
import type { CreateDisposisiInput, DisposisiItem } from '../types'

interface UseDisposisiParams {
    enabled: boolean
    page: number
    pageSize: number
    search: string
    setPage: Dispatch<SetStateAction<number>>
}

interface LoadedState {
    key: string
    items: DisposisiItem[]
    total: number
    error: string | null
}

export function useDisposisi({
    enabled,
    page,
    pageSize,
    search,
    setPage,
}: UseDisposisiParams) {
    const [reloadCount, setReloadCount] = useState(0)
    const [loaded, setLoaded] = useState<LoadedState | null>(null)

    const key = `${page}|${pageSize}|${search}|${reloadCount}`

    useEffect(() => {
        if (!enabled) {
            return
        }

        let cancelled = false

        fetchDisposisiList({ page, limit: pageSize, search })
            .then((result) => {
                if (cancelled) return
                setLoaded({
                    key,
                    items: result.items,
                    total: result.pagination.total,
                    error: null,
                })
            })
            .catch((err) => {
                if (cancelled) return
                setLoaded({
                    key,
                    items: [],
                    total: 0,
                    error:
                        err instanceof Error
                            ? err.message
                            : 'Gagal memuat data disposisi',
                })
            })

        return () => {
            cancelled = true
        }
    }, [enabled, page, pageSize, search, key])

    const items = loaded?.items ?? []
    const loading = enabled && loaded?.key !== key

    function reload() {
        setReloadCount((count) => count + 1)
    }

    async function save(data: CreateDisposisiInput, editId?: string) {
        if (editId) {
            await patchUpdateDisposisi(editId, data)
            reload()
            return
        }

        await postCreateDisposisi(data)

        if (page !== 1) {
            setPage(1)
        } else {
            reload()
        }
    }

    async function remove(id: string) {
        await deleteDisposisiById(id)

        if (items.length === 1 && page > 1) {
            setPage((prev) => prev - 1)
        } else {
            reload()
        }
    }

    return {
        items,
        total: loaded?.total ?? 0,
        loading,
        error: loaded?.error ?? null,
        reload,
        save,
        remove,
    }
}