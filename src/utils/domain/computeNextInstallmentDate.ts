import { addDays, addMonths, addYears, format, parseISO } from 'date-fns'
import { PaymentFrequency } from '@/typings/domain/enums'

export function computeNextInstallmentDate(
  currentDate: string,
  frequency: PaymentFrequency = PaymentFrequency.MONTHLY
): string {
  const date = parseISO(currentDate)
  const next =
    frequency === PaymentFrequency.DAILY
      ? addDays(date, 1)
      : frequency === PaymentFrequency.YEARLY
        ? addYears(date, 1)
        : addMonths(date, 1)
  return format(next, 'yyyy-MM-dd')
}
