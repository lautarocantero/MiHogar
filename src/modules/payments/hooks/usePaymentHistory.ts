import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectMovementsByPaymentId } from '@/store/movements/movementsSelectors'
import { computeHistoryComparativePhrase } from '@/utils/domain/computeHistoryComparativePhrase'
import type { PaymentHistoryData } from '../typings/types'

const HISTORY_MONTHS_LIMIT = 3

export function usePaymentHistory(paymentId: string): PaymentHistoryData {
  const movements = useAppSelector((state) => selectMovementsByPaymentId(state, paymentId))

  return useMemo(() => {
    const sortedMovements = [...movements].sort((a, b) => b.date.localeCompare(a.date))
    const recentMovements = sortedMovements.slice(0, HISTORY_MONTHS_LIMIT)

    return {
      entries: recentMovements.map((movement) => ({
        movement,
        monthLabel: format(parseISO(movement.date), "MMMM 'de' yyyy", { locale: es })
      })),
      comparativePhrase: computeHistoryComparativePhrase(sortedMovements)
    }
  }, [movements])
}
