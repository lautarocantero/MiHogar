import { z } from 'zod'
import { t } from '@/i18n'
import { MAX_ABS_AMOUNT, isAmountInRange } from '@/utils/domain/amountLimits'

/**
 * Número de los esquemas del vault: finito y dentro de ±`MAX_ABS_AMOUNT`. `Infinity`
 * se serializa como `null` en JSON, así que nunca puede llegar a guardarse.
 */
export function boundedNumber(params?: z.RawCreateParams): z.ZodNumber {
  return z.number(params).finite().gte(-MAX_ABS_AMOUNT).lte(MAX_ABS_AMOUNT)
}

/**
 * Wraps a z.number()-based schema so an empty/untouched number input (which
 * react-hook-form reports as NaN via `valueAsNumber`) is treated as "no value"
 * instead of being coerced into 0. Rechaza antes que nada los montos no finitos o
 * fuera de rango (ver `parseAmountInput`) con un mensaje traducido.
 */
export function numberField<T extends z.ZodTypeAny>(schema: T): z.ZodEffects<T> {
  return z.preprocess(
    (value) => (typeof value === 'number' && Number.isNaN(value) ? undefined : value),
    z
      .any()
      .superRefine((value, ctx) => {
        if (typeof value === 'number' && !isAmountInRange(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('vaultErrors.amountTooLarge'),
            fatal: true
          })
        }
      })
      .pipe(schema)
  ) as unknown as z.ZodEffects<T>
}
