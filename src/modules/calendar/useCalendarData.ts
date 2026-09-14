import { useMemo } from 'react'
import { addDays, format, isWithinInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { PaymentStatus, MovementType } from '@/typings/domain/enums'
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

    const paymentsThisMonth = payments.filter((payment) => payment.dueDate.startsWith(currentMonth))
    const incomesThisMonth = movements.filter(
      (movement) => movement.type === MovementType.INCOME && movement.date.startsWith(currentMonth)
    )

    const eventsByIsoDate = new Map<string, CalendarDayEvent>()
    paymentsThisMonth.forEach((payment) => {
      eventsByIsoDate.set(payment.dueDate, {
        kind:
          payment.status === PaymentStatus.PAID
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

    const totalDue = paymentsThisMonth.reduce((total, payment) => total + payment.amount, 0)
    const paidSoFar = paymentsThisMonth
      .filter((payment) => payment.status === PaymentStatus.PAID)
      .reduce((total, payment) => total + payment.amount, 0)

    const weekEnd = addDays(today, WEEK_AHEAD_DAYS)
    const accountsById = new Map(accounts.map((account) => [account.id, account]))
    const weekAheadPayments = payments
      .filter(
        (payment) =>
          payment.status === PaymentStatus.PENDING &&
          isWithinInterval(parseISO(payment.dueDate), { start: today, end: weekEnd })
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .map((payment) => ({
        ...payment,
        accountName: accountsById.get(payment.accountId)?.name ?? 'Cuenta sin definir'
      }))

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
