import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectPendingPayments } from '@/store/payments/paymentsSelectors'
import { getPreferences } from '@/apis/preferencesApi'
import { checkPaymentReminders } from '@/apis/remindersApi'
import { computeDueReminders } from '@/utils/domain/computeDueReminders'
import { useHandleError } from './useHandleError'

const CHECK_INTERVAL_MS = 60 * 60 * 1000

export function usePaymentReminderScheduler(): void {
  const pendingPayments = useAppSelector(selectPendingPayments)
  const paymentsRef = useRef(pendingPayments)
  paymentsRef.current = pendingPayments
  const handleError = useHandleError()

  useEffect(() => {
    let isCancelled = false

    const checkNow = async (): Promise<void> => {
      try {
        const preferences = await getPreferences()
        if (isCancelled || !preferences.remindersEnabled) {
          return
        }
        const reminders = computeDueReminders(paymentsRef.current, preferences.reminderLeadDays)
        if (reminders.length > 0) {
          await checkPaymentReminders(reminders)
        }
      } catch (error) {
        handleError(error, 'No se pudieron revisar los recordatorios de pago')
      }
    }

    checkNow()
    const intervalId = window.setInterval(checkNow, CHECK_INTERVAL_MS)

    return (): void => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [handleError])
}
