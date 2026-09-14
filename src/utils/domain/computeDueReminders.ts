import { isToday, isTomorrow, parseISO } from 'date-fns'
import type { Payment } from '@/typings/domain/types'
import type { ReminderNotification } from '@shared/vaultEnvelope.types'

export function computeDueReminders(pendingPayments: Payment[]): ReminderNotification[] {
  return pendingPayments
    .filter((payment) => payment.reminderEnabled !== false)
    .filter((payment) => {
      const dueDate = parseISO(payment.dueDate)
      return isToday(dueDate) || isTomorrow(dueDate)
    })
    .map((payment) => ({
      paymentId: payment.id,
      concept: payment.concept,
      dueDate: payment.dueDate,
      amount: payment.amount
    }))
}
