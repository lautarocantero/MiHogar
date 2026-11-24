import { t } from '@/i18n'
import { formatLongDayMonth } from '@/utils/formatting/formatDate'
import type { SavingsInstrument } from '@/typings/domain/types'

export function resolveSavingsConditionText(instrument: SavingsInstrument): string {
  const parts: string[] = []

  if (instrument.maturityDate) {
    parts.push(t('format.savings.maturesOn', { date: formatLongDayMonth(instrument.maturityDate) }))
  }
  if (instrument.rateAnnual) {
    parts.push(t('format.ratePerYear', { rate: instrument.rateAnnual }))
  }
  if (parts.length === 0 && instrument.liquidAnytime) {
    return t('format.savings.liquidAnytime')
  }
  if (instrument.liquidAnytime) {
    parts.push(t('format.savings.liquidAnytime'))
  }

  return parts.join(' · ')
}
