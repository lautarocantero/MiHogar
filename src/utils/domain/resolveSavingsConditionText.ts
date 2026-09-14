import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { SavingsInstrument } from '@/typings/domain/types'

export function resolveSavingsConditionText(instrument: SavingsInstrument): string {
  const parts: string[] = []

  if (instrument.maturityDate) {
    parts.push(
      `Vence el ${format(parseISO(instrument.maturityDate), "d 'de' MMMM", { locale: es })}`
    )
  }
  if (instrument.rateAnnual) {
    parts.push(`${instrument.rateAnnual}% anual`)
  }
  if (parts.length === 0 && instrument.liquidAnytime) {
    return 'Podés sacarlo cuando quieras'
  }
  if (instrument.liquidAnytime) {
    parts.push('Podés sacarlo cuando quieras')
  }

  return parts.join(' · ')
}
