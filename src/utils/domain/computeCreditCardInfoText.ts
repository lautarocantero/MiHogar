import { t } from '@/i18n'

export function computeCreditCardInfoText(closingDay?: number, dueDay?: number): string | null {
  if (!closingDay || !dueDay) {
    return null
  }

  return t('format.creditCardInfo', { closingDay, dueDay })
}
