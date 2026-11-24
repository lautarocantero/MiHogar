import { t } from '@/i18n'
import type { Debt } from '@/typings/domain/types'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { resolveFrequencyLabel } from './resolveFrequencyLabel'

export function resolveDebtConditionText(debt: Debt): string {
  const parts: string[] = []

  if (debt.installmentAmount) {
    parts.push(t('format.debt.installmentOf', { amount: formatCurrency(debt.installmentAmount) }))
  }
  if (debt.installmentsTotal) {
    const remaining = Math.max(debt.installmentsTotal - (debt.installmentsPaid ?? 0), 0)
    parts.push(
      t('format.debt.installmentsRemaining', { remaining, total: debt.installmentsTotal })
    )
  }
  const frequencyLabel = resolveFrequencyLabel(debt.frequency)
  if (frequencyLabel) {
    parts.push(frequencyLabel)
  }
  if (debt.nextInstallmentDate) {
    parts.push(formatDueLabel(debt.nextInstallmentDate, 'nextInstallment'))
  }
  if (debt.rateAnnual) {
    parts.push(t('format.ratePerYear', { rate: debt.rateAnnual }))
  }

  return parts.join(' · ')
}
