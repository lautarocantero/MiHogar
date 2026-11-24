import { isAmountInRange } from '@/utils/domain/amountLimits'

/**
 * Convierte lo tipeado ("1.234,56") en número. Si el valor no es finito o supera
 * `MAX_ABS_AMOUNT` devuelve `Infinity`: así la validación del formulario (`numberField`)
 * lo rechaza con "El monto es demasiado grande" en vez de guardarlo o pasarlo a 0.
 */
export function parseAmountInput(raw: string | number): number {
  // react-hook-form invoca `setValueAs` también al registrar el ref con el
  // defaultValue crudo (un number cuando se edita un registro existente),
  // no sólo con el string tipeado en el input.
  if (typeof raw === 'number') return raw

  const normalized = raw
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^0-9.]/g, '')
  const value = Number(normalized)
  if (Number.isNaN(value)) return 0
  if (!isAmountInRange(value)) return Number.POSITIVE_INFINITY
  return value
}
