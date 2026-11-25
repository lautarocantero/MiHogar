import { format, getDaysInMonth, parseISO, subMonths } from 'date-fns'
import type { Account, Payment } from '@/typings/domain/types'
import { PaymentKind, PaymentStatus } from '@/typings/domain/enums'

/**
 * Último cierre de la tarjeta en o antes de `paymentIsoDate` (ISO yyyy-MM-dd). Si el día de
 * cierre no existe en ese mes (ej. 31 en febrero) se usa el último día del mes.
 */
export function resolveLastClosingIsoDate(closingDay: number, paymentIsoDate: string): string {
  const paymentDate = parseISO(paymentIsoDate)
  const closingInMonth = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), Math.min(closingDay, getDaysInMonth(date)))
  const thisMonthClosing = closingInMonth(paymentDate)
  const lastClosing =
    thisMonthClosing <= paymentDate ? thisMonthClosing : closingInMonth(subMonths(paymentDate, 1))
  return format(lastClosing, 'yyyy-MM-dd')
}

/**
 * Pagos pendientes que quedan saldados al pagar la tarjeta: los gastos de esa tarjeta que
 * entraron en el resumen (vencimiento hasta el último cierre; sin día de cierre, hasta la fecha
 * del pago), del más viejo al más nuevo, mientras el monto pagado alcance. El primero que no
 * entra corta la lista para respetar el orden.
 */
export function selectCardPaymentsToSettle(
  payments: Payment[],
  card: Account,
  paidAmount: number,
  paymentIsoDate: string
): Payment[] {
  const cutoffIsoDate = card.closingDay
    ? resolveLastClosingIsoDate(card.closingDay, paymentIsoDate)
    : paymentIsoDate

  const candidates = payments
    .filter(
      (payment) =>
        payment.accountId === card.id &&
        payment.status === PaymentStatus.PENDING &&
        payment.kind !== PaymentKind.DEPOSIT &&
        payment.dueDate <= cutoffIsoDate
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  const settled: Payment[] = []
  let remaining = paidAmount
  for (const payment of candidates) {
    // Tolerancia de medio centavo: las restas con decimales acumulan error de coma flotante.
    if (payment.amount > remaining + 0.005) break
    settled.push(payment)
    remaining -= payment.amount
  }
  return settled
}
