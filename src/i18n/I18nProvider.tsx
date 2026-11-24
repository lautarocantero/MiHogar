import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale, TranslateFn } from './types'
import { detectInitialLocale, persistLocale, setCurrentLocale, translate } from './translate'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslateFn
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initial = detectInitialLocale()
    setCurrentLocale(initial)
    return initial
  })

  useEffect(() => {
    setCurrentLocale(locale)
    document.documentElement.lang = locale === 'en' ? 'en' : 'es-AR'
    document.title = translate(locale, 'common.appName')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', translate(locale, 'common.appDescription'))
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next)
    setLocaleState(next)
  }, [])

  const t = useCallback<TranslateFn>((key, params) => translate(locale, key, params), [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
