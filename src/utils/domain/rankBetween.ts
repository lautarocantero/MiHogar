const RANK_GAP = 1000
const MIN_GAP = 1e-9

export function rankBetween(before?: number, after?: number): number {
  if (before === undefined && after === undefined) {
    return 0
  }
  if (before === undefined && after !== undefined) {
    return after - RANK_GAP
  }
  if (before !== undefined && after === undefined) {
    return before + RANK_GAP
  }
  return ((before as number) + (after as number)) / 2
}

export function needsRebalance(before?: number, after?: number): boolean {
  if (before === undefined || after === undefined) {
    return false
  }
  return Math.abs(after - before) < MIN_GAP
}

export function rebalanceRanks<T>(items: T[]): { item: T; rank: number }[] {
  return items.map((item, index) => ({ item, rank: (index + 1) * RANK_GAP }))
}
