import type { ReminderNotification } from '@shared/vaultEnvelope.types'
import { getCurrentLocale, t } from '@/i18n'

/**
 * Recordatorios con la Web Notifications API (también funciona en Electron).
 * Sin soporte o sin permiso, no hace nada. Cada pago se avisa una vez por día y por
 * vencimiento en este dispositivo (antes: una vez por ejecución de la app).
 */
export type ReminderPermission = 'granted' | 'denied' | 'default' | 'unsupported'

const NOTIFIED_STORAGE_KEY = 'mihogar.notifiedReminders'
const notifiedInMemory = new Set<string>()

export function getReminderPermission(): ReminderPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}

/** Pide permiso. Llamarlo desde un gesto del usuario (click), si no algunos navegadores lo ignoran. */
export async function requestReminderPermission(): Promise<ReminderPermission> {
  if (getReminderPermission() === 'unsupported') return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    return getReminderPermission()
  }
}

function todayKey(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function readNotified(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(NOTIFIED_STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function writeNotified(notified: Record<string, string>): void {
  try {
    window.localStorage.setItem(NOTIFIED_STORAGE_KEY, JSON.stringify(notified))
  } catch {
    // sin almacenamiento: queda la deduplicación en memoria
  }
}

function formatAmount(amount: number): string {
  const locale = getCurrentLocale() === 'en' ? 'en-US' : 'es-AR'
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'ARS' }).format(amount)
}

export async function checkPaymentReminders(reminders: ReminderNotification[]): Promise<void> {
  if (getReminderPermission() !== 'granted') return

  const today = todayKey()
  // Solo se conservan las marcas de hoy: mañana se vuelve a avisar si sigue pendiente.
  const stored = Object.fromEntries(
    Object.entries(readNotified()).filter(([, day]) => day === today)
  )

  reminders.forEach((reminder) => {
    const dedupeKey = `${reminder.paymentId}:${reminder.dueDate}`
    if (stored[dedupeKey] === today || notifiedInMemory.has(`${dedupeKey}:${today}`)) return
    notifiedInMemory.add(`${dedupeKey}:${today}`)
    stored[dedupeKey] = today
    try {
      new Notification(t('reminders.notificationTitle', { concept: reminder.concept }), {
        body: t('reminders.notificationBody', {
          dueDate: reminder.dueDate,
          amount: formatAmount(reminder.amount)
        }),
        tag: dedupeKey
      })
    } catch {
      // Algunos navegadores móviles solo permiten notificaciones desde un service worker.
    }
  })

  writeNotified(stored)
}
