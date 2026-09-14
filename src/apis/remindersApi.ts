import type { ReminderNotification } from '@shared/vaultEnvelope.types'

export function checkPaymentReminders(reminders: ReminderNotification[]): Promise<void> {
  return window.remindersApi.check(reminders)
}
