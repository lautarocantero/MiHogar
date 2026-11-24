import { enUS, es } from 'date-fns/locale'
import type { Locale as DateFnsLocale } from 'date-fns'
import { getCurrentLocale } from './translate'
import type { Locale } from './types'

/** Locale de date-fns que corresponde al idioma de la app. */
export function getDateFnsLocale(locale: Locale = getCurrentLocale()): DateFnsLocale {
  return locale === 'en' ? enUS : es
}

/** Locale BCP 47 para `Intl` (números, monedas, fechas). */
export function getIntlLocale(locale: Locale = getCurrentLocale()): string {
  return locale === 'en' ? 'en-US' : 'es-AR'
}
