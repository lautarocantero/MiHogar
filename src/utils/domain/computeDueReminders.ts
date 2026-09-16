import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { Payment } from '@/typings/domain/types'
import type { ReminderNotification } from '@shared/vaultEnvelope.types'

export function computeDueReminders(
  pendingPayments: Payment[],
  leadDays: number = 1
): ReminderNotification[] {
  return pendingPayments
    .filter((payment) => payment.reminderEnabled !== false)
    .filter((payment) => {
      const daysRemaining = differenceInCalendarDays(parseISO(payment.dueDate), new Date())
      return daysRemaining >= 0 && daysRemaining <= leadDays
    })
    .map((payment) => ({
      paymentId: payment.id,
      concept: payment.concept,
      dueDate: payment.dueDate,
      amount: payment.amount
    }))
}
