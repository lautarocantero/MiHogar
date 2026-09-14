export function computeCreditCardInfoText(
  closingDay?: number,
  dueDay?: number,
  installmentsRemaining?: number
): string | null {
  const parts: string[] = []

  if (closingDay && dueDay) {
    parts.push(`Cierra el ${closingDay} y vence el ${dueDay}`)
  }

  if (typeof installmentsRemaining === 'number' && installmentsRemaining > 0) {
    parts.push(
      `Quedan ${installmentsRemaining} ${installmentsRemaining === 1 ? 'cuota' : 'cuotas'}`
    )
  }

  if (parts.length === 0) {
    return null
  }

  return `${parts.join('. ')}.`
}
