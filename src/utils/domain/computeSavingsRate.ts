export function computeSavingsRate(totalIn: number, totalOut: number): number {
  if (totalIn <= 0) {
    return 0
  }
  return Math.round(((totalIn - totalOut) / totalIn) * 100)
}
