import { useMemo } from 'react'
import { addMonths, differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { PaymentKind, PaymentStatus, MovementType } from '@/typings/domain/enums'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { resolveMovementConcept } from '@/utils/domain/resolveMovementConcept'
import { isFinalInstallmentPayment } from '@/utils/domain/isFinalInstallmentPayment'
import { buildCalendarWeeks } from './buildCalendarWeeks'
import { CalendarEventKind } from './typings/enums'
import type { CalendarData, CalendarDayEvent, FinalInstallmentSummary } from './typings/types'

export function useCalendarData(monthOffset = 0): CalendarData {
  const payments = useAppSelector(selectAllPayments)
  const movements = useAppSelector(selectAllMovements)
  const accounts = useAppSelector(selectAllAccounts)
  const categories = useAppSelector(selectAllCategories)

  return useMemo(() => {
    const today = startOfDay(new Date())
    const referenceDate = addMonths(today, monthOffset)
    const currentMonth = format(referenceDate, 'yyyy-MM')
    const accountsById = new Map(accounts.map((account) => [account.id, account]))

    const paymentsWithDisplayDate = payments.map((payment) => ({
      ...payment,
      accountName: accountsById.get(payment.accountId)?.name ?? 'Cuenta sin definir',
      displayDate: resolvePaymentDisplayDate(payment, accountsById.get(payment.accountId), today)
    }))

    const paymentsThisMonth = paymentsWithDisplayDate.filter((payment) =>
      payment.displayDate.startsWith(currentMonth)
    )
    const incomesThisMonth = movements.filter(
      (movement) => movement.type === MovementType.INCOME && movement.date.startsWith(currentMonth)
    )
    const looseMovementsThisMonth = movements.filter(
      (movement) =>
        movement.type !== MovementType.INCOME &&
        movement.paymentId == null &&
        movement.date.startsWith(currentMonth)
    )

    const eventsByIsoDate = new Map<string, CalendarDayEvent[]>()
    const pushEvent = (isoDate: string, event: CalendarDayEvent): void => {
      const existing = eventsByIsoDate.get(isoDate)
      if (existing) {
        existing.push(event)
      } else {
        eventsByIsoDate.set(isoDate, [event])
      }
    }

    paymentsThisMonth.forEach((payment) => {
      pushEvent(payment.displayDate, {
        kind:
          payment.kind === PaymentKind.DEPOSIT
            ? CalendarEventKind.INCOME
            : payment.status === PaymentStatus.PAID
              ? CalendarEventKind.PAID
              : CalendarEventKind.PENDING,
        amount: payment.amount,
        label: payment.concept,
        isFinalInstallment: isFinalInstallmentPayment(payment)
      })
    })
    incomesThisMonth.forEach((movement) => {
      pushEvent(movement.date, {
        kind: CalendarEventKind.INCOME,
        amount: movement.amount,
        label: resolveMovementConcept(movement, payments, categories)
      })
    })
    looseMovementsThisMonth.forEach((movement) => {
      pushEvent(movement.date, {
        kind: CalendarEventKind.PAID,
        amount: movement.amount,
        label: resolveMovementConcept(movement, payments, categories)
      })
    })

    const weeks = buildCalendarWeeks(referenceDate, today, eventsByIsoDate)

    const expensesThisMonth = paymentsThisMonth.filter(
      (payment) => payment.kind !== PaymentKind.DEPOSIT
    )
    const totalDue = expensesThisMonth.reduce((total, payment) => total + payment.amount, 0)
    const paidSoFar = expensesThisMonth
      .filter((payment) => payment.status === PaymentStatus.PAID)
      .reduce((total, payment) => total + payment.amount, 0)

    const finalInstallmentPayments: FinalInstallmentSummary[] = paymentsThisMonth
      .filter((payment) => isFinalInstallmentPayment(payment))
      .map((payment) => ({
        concept: payment.concept,
        daysUntil: differenceInCalendarDays(parseISO(payment.displayDate), today)
      }))
      .filter((entry) => entry.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)

    return {
      weeks,
      monthLabel: format(referenceDate, 'MMMM', { locale: es }),
      progress: {
        totalDue,
        paidSoFar,
        progressPercent: totalDue > 0 ? Math.min(100, Math.round((paidSoFar / totalDue) * 100)) : 0
      },
      finalInstallmentPayments
    }
  }, [payments, movements, accounts, categories, monthOffset])
}
