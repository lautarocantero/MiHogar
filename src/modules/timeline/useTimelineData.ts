import { useMemo } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { useAppSelector } from '@/store/hooks'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { resolveMovementConcept } from '@/utils/domain/resolveMovementConcept'
import { resolveMovementDetail } from '@/utils/domain/resolveMovementDetail'
import { computeFlowSummary } from '@/utils/domain/computeFlowSummary'
import type { TimelineData } from './typings/types'

const WINDOW_DAYS_PAST = 30
const WINDOW_DAYS_FUTURE = 15

export function useTimelineData(): TimelineData {
  const movements = useAppSelector(selectAllMovements)
  const accounts = useAppSelector(selectAllAccounts)
  const payments = useAppSelector(selectAllPayments)
  const categories = useAppSelector(selectAllCategories)

  return useMemo(() => {
    const today = new Date()
    const windowedMovements = movements.filter((movement) => {
      const daysFromToday = differenceInCalendarDays(parseISO(movement.date), today)
      return daysFromToday >= -WINDOW_DAYS_PAST && daysFromToday <= WINDOW_DAYS_FUTURE
    })

    const entries = windowedMovements.map((movement) => {
      const daysFromToday = differenceInCalendarDays(parseISO(movement.date), today)
      return {
        movement,
        concept: resolveMovementConcept(movement, payments, categories),
        detail: resolveMovementDetail(movement, accounts),
        isEstimated: daysFromToday > 0,
        isPast: daysFromToday < 0
      }
    })

    return {
      summary: computeFlowSummary(windowedMovements),
      entries
    }
  }, [movements, accounts, payments, categories])
}
