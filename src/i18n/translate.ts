import { DICTIONARIES } from './dictionaries'
import type { Locale, TranslateParams } from './types'

export const DEFAULT_LOCALE: Locale = 'es'
export const SUPPORTED_LOCALES: Locale[] = ['es', 'en']
const STORAGE_KEY = 'gastito.locale'

export function isLocale(value: unknown): value is Locale {
  return value === 'es' || value === 'en'
}

export function detectInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage puede no estar disponible (modo privado, políticas del navegador)
  }
  const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : ''
  return browserLanguage.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LOCALE
}

export function persistLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // sin persistencia: se vuelve a detectar en la próxima carga
  }
}

/** Traduce fuera de React (thunks, middleware, mensajes de error). */
export function translate(locale: Locale, key: string, params?: TranslateParams): string {
  const template = DICTIONARIES[locale][key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  )
}

let currentLocale: Locale = DEFAULT_LOCALE

export function getCurrentLocale(): Locale {
  return currentLocale
}

export function setCurrentLocale(locale: Locale): void {
  currentLocale = locale
}

/** Atajo para código no-React: usa el idioma activo. */
export function t(key: string, params?: TranslateParams): string {
  return translate(currentLocale, key, params)
}
