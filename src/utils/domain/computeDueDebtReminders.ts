import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { Debt } from '@/typings/domain/types'
import { DebtStatus } from '@/typings/domain/enums'
import type { ReminderNotification } from '@shared/vaultEnvelope.types'

export function computeDueDebtReminders(
  activeDebts: Debt[],
  leadDays: number = 1
): ReminderNotification[] {
  return activeDebts
    .filter((debt) => debt.status === DebtStatus.ACTIVE)
    .filter((debt) => debt.reminderEnabled !== false)
    .filter((debt) => Boolean(debt.nextInstallmentDate))
    .filter((debt) => {
      const daysRemaining = differenceInCalendarDays(
        parseISO(debt.nextInstallmentDate as string),
        new Date()
      )
      return daysRemaining >= 0 && daysRemaining <= leadDays
    })
    .map((debt) => ({
      paymentId: debt.id,
      concept: debt.name,
      dueDate: debt.nextInstallmentDate as string,
      amount: debt.installmentAmount ?? debt.outstandingBalance,
      kind: 'debt' as const
    }))
}
