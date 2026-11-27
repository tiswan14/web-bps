type DetailItem = {
  label: string
  value: string | null | undefined
}

export function filterPegawaiDetails(items: DetailItem[]) {
  return items.filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      item.value.trim() !== '',
  )
}
