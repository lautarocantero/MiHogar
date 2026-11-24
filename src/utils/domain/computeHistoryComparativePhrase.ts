import { format, parseISO } from 'date-fns'
import { getDateFnsLocale, t } from '@/i18n'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { Movement } from '@/typings/domain/types'

export function computeHistoryComparativePhrase(sortedMovements: Movement[]): string | null {
  if (sortedMovements.length < 2) {
    return null
  }

  const [latest, previous] = sortedMovements
  const difference = latest.amount - previous.amount
  const month = format(parseISO(previous.date), 'MMMM', { locale: getDateFnsLocale() })

  if (difference === 0) {
    return t('format.history.same', { month })
  }

  return t(difference > 0 ? 'format.history.more' : 'format.history.less', {
    amount: formatCurrency(Math.abs(difference)),
    month
  })
}
