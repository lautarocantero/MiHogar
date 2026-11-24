import { t } from '@/i18n'
import type { PaymentFrequency } from '@/typings/domain/enums'

export function resolveFrequencyLabel(frequency?: PaymentFrequency): string | null {
  if (!frequency) {
    return null
  }
  return t(`format.frequency.${frequency}`)
}
