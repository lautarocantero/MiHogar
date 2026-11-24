import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { getDateFnsLocale, useI18n } from '@/i18n'
import { useAppSelector } from '@/store/hooks'
import { selectMovementsByPaymentId } from '@/store/movements/movementsSelectors'
import { computeHistoryComparativePhrase } from '@/utils/domain/computeHistoryComparativePhrase'
import type { PaymentHistoryData } from '../typings/types'

const HISTORY_MONTHS_LIMIT = 3

export function usePaymentHistory(paymentId: string): PaymentHistoryData {
  const movements = useAppSelector((state) => selectMovementsByPaymentId(state, paymentId))

  const { locale, t } = useI18n()

  return useMemo(() => {
    const sortedMovements = [...movements].sort((a, b) => b.date.localeCompare(a.date))
    const recentMovements = sortedMovements.slice(0, HISTORY_MONTHS_LIMIT)

    return {
      entries: recentMovements.map((movement) => ({
        movement,
        monthLabel: format(parseISO(movement.date), t('payments.history.monthFormat'), {
          locale: getDateFnsLocale(locale)
        })
      })),
      comparativePhrase: computeHistoryComparativePhrase(sortedMovements)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- la frase comparativa usa el idioma activo
  }, [movements, locale, t])
}
