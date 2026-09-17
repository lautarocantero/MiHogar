import type { FlowSummary } from '@/typings/domain/types'
import type { UnifiedEntry } from '@/modules/payments/typings/types'
import { MovementType, PaymentKind } from '@/typings/domain/enums'

export function computeEntriesFlowSummary(entries: UnifiedEntry[]): FlowSummary {
  let totalIn = 0
  let totalOut = 0

  entries.forEach((entry) => {
    const isIncome =
      entry.origin === 'payment'
        ? entry.kind === PaymentKind.DEPOSIT
        : entry.movement.type === MovementType.INCOME
    const isExpense =
      entry.origin === 'payment'
        ? entry.kind !== PaymentKind.DEPOSIT
        : entry.movement.type === MovementType.EXPENSE

    if (isIncome) {
      totalIn += entry.amount
    } else if (isExpense) {
      totalOut += entry.amount
    }
  })

  return { totalIn, totalOut, difference: totalIn - totalOut }
}
