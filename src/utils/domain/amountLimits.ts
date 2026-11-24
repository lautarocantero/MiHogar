/**
 * Tope absoluto para cualquier monto o número guardado en el vault. Por encima de esto
 * los `number` de JS pierden precisión y, si llegan a `Infinity`, `JSON.stringify` los
 * guarda como `null` y el vault deja de pasar la validación al abrirse.
 */
export const MAX_ABS_AMOUNT = 1e15

export function isAmountInRange(value: number): boolean {
  return Number.isFinite(value) && Math.abs(value) <= MAX_ABS_AMOUNT
}
