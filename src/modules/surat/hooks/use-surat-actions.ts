import type { TabSurat } from '@/modules/surat/constants/surat-tabs'
import type {
  CreateSuratInput,
  SuratItem,
  UpdateSuratInput,
} from '@/modules/surat/types'

interface UseSuratActionsParams {
  activeTab: TabSurat
  setActiveTab: (tab: TabSurat) => void
  page: number
  setPage: (page: number | ((prev: number) => number)) => void
  suratList: SuratItem[]
  refreshSurat: () => Promise<void>
  createSurat: (data: CreateSuratInput) => Promise<unknown>
  updateSurat: (id: string, data: UpdateSuratInput) => Promise<unknown>
  deleteSurat: (id: string) => Promise<unknown>
}

export function useSuratActions({
  activeTab,
  setActiveTab,
  page,
  setPage,
  suratList,
  refreshSurat,
  createSurat,
  updateSurat,
  deleteSurat,
}: UseSuratActionsParams) {
  async function save(data: CreateSuratInput, editId?: string) {
    if (editId) {
      await updateSurat(editId, data)
      await refreshSurat()
      return
    }

    await createSurat(data)

    const targetTab: TabSurat =
      data.jenis === 'KELUAR' ? 'surat-keluar' : 'surat-masuk'

    if (activeTab !== targetTab) {
      setActiveTab(targetTab)
      setPage(1)
    } else if (page !== 1) {
      setPage(1)
    } else {
      await refreshSurat()
    }
  }

  async function remove(id: string) {
    await deleteSurat(id)

    if (suratList.length === 1 && page > 1) {
      setPage((prev) => prev - 1)
    } else {
      await refreshSurat()
    }
  }

  return { save, remove }
}
