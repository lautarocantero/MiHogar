export function parseAmountInput(raw: string | number): number {
  // react-hook-form invoca `setValueAs` también al registrar el ref con el
  // defaultValue crudo (un number cuando se edita un registro existente),
  // no sólo con el string tipeado en el input.
  if (typeof raw === 'number') return raw

  const normalized = raw
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^0-9.]/g, '')
  return Number(normalized) || 0
}
