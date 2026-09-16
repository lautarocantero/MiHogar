import { PaymentFrequency } from '@/typings/domain/enums'

const FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  [PaymentFrequency.DAILY]: 'Día a día',
  [PaymentFrequency.MONTHLY]: 'Todos los meses',
  [PaymentFrequency.YEARLY]: 'Una vez al año',
  [PaymentFrequency.ONCE]: 'Una sola vez'
}

export function resolveFrequencyLabel(frequency?: PaymentFrequency): string | null {
  if (!frequency) {
    return null
  }
  return FREQUENCY_LABELS[frequency]
}
