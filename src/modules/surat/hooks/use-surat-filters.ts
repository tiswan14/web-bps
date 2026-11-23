import { useEffect, useState } from 'react'

import type { TabSurat } from '@/modules/surat/constants/surat-tabs'

const SEARCH_DEBOUNCE_MS = 350

export function useSuratFilters() {
  const [activeTab, setActiveTab] = useState<TabSurat>('surat-masuk')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  function changeTab(tab: TabSurat) {
    setActiveTab(tab)
    setSearch('')
    setDebouncedSearch('')
    setPage(1)
  }

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function changePageSize(size: number) {
    setPageSize(size)
    setPage(1)
  }

  return {
    activeTab,
    setActiveTab,
    search,
    debouncedSearch,
    page,
    setPage,
    pageSize,
    changeTab,
    changeSearch,
    changePageSize,
  }
}
