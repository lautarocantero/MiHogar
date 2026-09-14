import { Notification } from 'electron'
import type { ReminderNotification } from '@shared/vaultEnvelope.types'

const notifiedToday = new Set<string>()

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}

export function notifyPendingPayments(reminders: ReminderNotification[]): void {
  if (!Notification.isSupported()) {
    return
  }

  reminders.forEach((reminder) => {
    const dedupeKey = `${reminder.paymentId}:${reminder.dueDate}`
    if (notifiedToday.has(dedupeKey)) {
      return
    }
    notifiedToday.add(dedupeKey)

    new Notification({
      title: `Recordatorio: ${reminder.concept}`,
      body: `Vence el ${reminder.dueDate} · ${formatAmount(reminder.amount)}`
    }).show()
  })
}
