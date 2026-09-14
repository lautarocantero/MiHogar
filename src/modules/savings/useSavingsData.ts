import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllSavingsInstruments, selectTotalSaved } from '@/store/savings/savingsSelectors'
import { selectAllMembers } from '@/store/household/householdSelectors'
import { resolveOwnerLabel } from '@/utils/domain/resolveOwnerLabel'
import { resolveSavingsConditionText } from '@/utils/domain/resolveSavingsConditionText'
import { computeNextMaturityDate } from '@/utils/domain/computeNextMaturityDate'
import type { SavingsData } from './typings/types'

export function useSavingsData(): SavingsData {
  const instruments = useAppSelector(selectAllSavingsInstruments)
  const totalSaved = useAppSelector(selectTotalSaved)
  const members = useAppSelector(selectAllMembers)

  return useMemo(() => {
    const instrumentViews = instruments.map((instrument) => ({
      ...instrument,
      ownerLabel: resolveOwnerLabel(instrument.ownerType, instrument.ownerId, members),
      conditionText: resolveSavingsConditionText(instrument)
    }))

    const monthlyInterestTotal = instruments.reduce(
      (total, instrument) => total + (instrument.monthlyInterestEstimate ?? 0),
      0
    )

    const nextMaturityDate = computeNextMaturityDate(instruments)

    return {
      summary: {
        totalSaved,
        monthlyInterestTotal,
        nextMaturityLabel: nextMaturityDate
          ? format(parseISO(nextMaturityDate), "d 'de' MMM", { locale: es })
          : null
      },
      instruments: instrumentViews
    }
  }, [instruments, totalSaved, members])
}
