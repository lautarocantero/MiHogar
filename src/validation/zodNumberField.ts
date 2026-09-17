import { z } from 'zod'

/**
 * Wraps a z.number()-based schema so an empty/untouched number input (which
 * react-hook-form reports as NaN via `valueAsNumber`) is treated as "no value"
 * instead of being coerced into 0.
 */
export function numberField<T extends z.ZodTypeAny>(schema: T): z.ZodEffects<T> {
  return z.preprocess(
    (value) => (typeof value === 'number' && Number.isNaN(value) ? undefined : value),
    schema
  ) as unknown as z.ZodEffects<T>
}
