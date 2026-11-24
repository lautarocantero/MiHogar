import { useContext } from 'react'
import { I18nContext } from './I18nProvider'

export function useI18n(): NonNullable<React.ContextType<typeof I18nContext>> {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n debe usarse dentro de <I18nProvider>')
  }
  return context
}

export function useT(): ReturnType<typeof useI18n>['t'] {
  return useI18n().t
}
