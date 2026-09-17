import type { Debt } from '@/typings/domain/types'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { resolveFrequencyLabel } from './resolveFrequencyLabel'

export function resolveDebtConditionText(debt: Debt): string {
  const parts: string[] = []

  if (debt.installmentAmount) {
    parts.push(`Cuota de ${formatCurrency(debt.installmentAmount)}`)
  }
  if (debt.installmentsTotal) {
    const remaining = Math.max(debt.installmentsTotal - (debt.installmentsPaid ?? 0), 0)
    parts.push(`${remaining} de ${debt.installmentsTotal} cuotas restantes`)
  }
  const frequencyLabel = resolveFrequencyLabel(debt.frequency)
  if (frequencyLabel) {
    parts.push(frequencyLabel)
  }
  if (debt.nextInstallmentDate) {
    parts.push(formatDueLabel(debt.nextInstallmentDate, 'Próxima cuota vence'))
  }
  if (debt.rateAnnual) {
    parts.push(`${debt.rateAnnual}% anual`)
  }

  return parts.join(' · ')
}
