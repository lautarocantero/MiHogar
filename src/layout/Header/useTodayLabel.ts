import { useMemo } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function useTodayLabel(): string {
  return useMemo(() => {
    const label = format(new Date(), "EEEE d 'de' MMMM", { locale: es })
    return label.charAt(0).toUpperCase() + label.slice(1)
  }, [])
}
