export function computeCreditCardInfoText(closingDay?: number, dueDay?: number): string | null {
  if (!closingDay || !dueDay) {
    return null
  }

  return `Cierra el ${closingDay} y vence el ${dueDay}.`
}
