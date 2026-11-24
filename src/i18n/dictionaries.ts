import type { Dictionary, Locale, LocaleNamespace } from './types'
import { common } from './locales/common'
import { layout } from './locales/layout'
import { importStatements } from './locales/importStatements'
import { auth } from './locales/auth'
import { onboarding } from './locales/onboarding'
import { sync } from './locales/sync'
import { attachments } from './locales/attachments'
import { reminders } from './locales/reminders'
import { settingsCloud } from './locales/settingsCloud'
import { format } from './locales/format'
import { accounts } from './locales/accounts'
import { payments } from './locales/payments'
import { settings } from './locales/settings'
import { notifications } from './locales/notifications'
import { validation } from './locales/validation'

/**
 * Registro de namespaces. Para agregar textos nuevos: crear
 * `locales/<namespace>.ts` con las mismas claves en `es` y `en`
 * y sumarlo a esta lista.
 */
const NAMESPACES: LocaleNamespace[] = [
  common,
  layout,
  importStatements,
  auth,
  onboarding,
  sync,
  attachments,
  reminders,
  settingsCloud,
  format,
  accounts,
  payments,
  settings,
  notifications,
  validation
]

function merge(locale: Locale): Dictionary {
  return NAMESPACES.reduce<Dictionary>((acc, namespace) => ({ ...acc, ...namespace[locale] }), {})
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  es: merge('es'),
  en: merge('en')
}
