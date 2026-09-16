import { useMemo } from 'react'
import { addDays, format, isWithinInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { PaymentKind, PaymentStatus, MovementType } from '@/typings/domain/enums'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { buildCalendarWeeks } from './buildCalendarWeeks'
import { CalendarEventKind } from './typings/enums'
import type { CalendarData, CalendarDayEvent } from './typings/types'

const WEEK_AHEAD_DAYS = 6

export function useCalendarData(): CalendarData {
  const payments = useAppSelector(selectAllPayments)
  const movements = useAppSelector(selectAllMovements)
  const accounts = useAppSelector(selectAllAccounts)

  return useMemo(() => {
    const today = new Date()
    const currentMonth = format(today, 'yyyy-MM')
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

    const eventsByIsoDate = new Map<string, CalendarDayEvent>()
    paymentsThisMonth.forEach((payment) => {
      eventsByIsoDate.set(payment.displayDate, {
        kind:
          payment.kind === PaymentKind.DEPOSIT
            ? CalendarEventKind.INCOME
            : payment.status === PaymentStatus.PAID
              ? CalendarEventKind.PAID
              : CalendarEventKind.PENDING,
        amount: payment.amount
      })
    })
    incomesThisMonth.forEach((movement) => {
      if (!eventsByIsoDate.has(movement.date)) {
        eventsByIsoDate.set(movement.date, {
          kind: CalendarEventKind.INCOME,
          amount: movement.amount
        })
      }
    })

    const weeks = buildCalendarWeeks(today, today, eventsByIsoDate)

    const expensesThisMonth = paymentsThisMonth.filter(
      (payment) => payment.kind !== PaymentKind.DEPOSIT
    )
    const totalDue = expensesThisMonth.reduce((total, payment) => total + payment.amount, 0)
    const paidSoFar = expensesThisMonth
      .filter((payment) => payment.status === PaymentStatus.PAID)
      .reduce((total, payment) => total + payment.amount, 0)

    const weekEnd = addDays(today, WEEK_AHEAD_DAYS)
    const weekAheadPayments = paymentsWithDisplayDate
      .filter(
        (payment) =>
          payment.status === PaymentStatus.PENDING &&
          isWithinInterval(parseISO(payment.displayDate), { start: today, end: weekEnd })
      )
      .sort((a, b) => a.displayDate.localeCompare(b.displayDate))

    return {
      weeks,
      monthLabel: format(today, 'MMMM', { locale: es }),
      progress: {
        totalDue,
        paidSoFar,
        progressPercent: totalDue > 0 ? Math.min(100, Math.round((paidSoFar / totalDue) * 100)) : 0
      },
      weekAheadPayments
    }
  }, [payments, movements, accounts])
}
