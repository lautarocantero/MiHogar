import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { Movement } from '@/typings/domain/types'

export function computeHistoryComparativePhrase(sortedMovements: Movement[]): string | null {
  if (sortedMovements.length < 2) {
    return null
  }

  const [latest, previous] = sortedMovements
  const difference = latest.amount - previous.amount
  const previousMonthLabel = format(parseISO(previous.date), 'MMMM', { locale: es })

  if (difference === 0) {
    return `Este mes pagás lo mismo que en ${previousMonthLabel}.`
  }

  const verb = difference > 0 ? 'más' : 'menos'
  return `Este mes pagás ${formatCurrency(Math.abs(difference))} ${verb} que en ${previousMonthLabel}.`
}
