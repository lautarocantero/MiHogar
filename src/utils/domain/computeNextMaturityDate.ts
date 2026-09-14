import type { SavingsInstrument } from '@/typings/domain/types'

export function computeNextMaturityDate(instruments: SavingsInstrument[]): string | null {
  const maturityDates = instruments
    .map((instrument) => instrument.maturityDate)
    .filter((date): date is string => Boolean(date))
    .sort()

  return maturityDates[0] ?? null
}
