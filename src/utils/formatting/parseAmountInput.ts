export function parseAmountInput(raw: string): number {
  const normalized = raw
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^0-9.]/g, '')
  return Number(normalized) || 0
}
