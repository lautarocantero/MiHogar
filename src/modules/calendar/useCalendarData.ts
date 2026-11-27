import { useMemo } from 'react'
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  parseISO,
  startOfDay,
  subDays
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppSelector } from '@/store/hooks'
import { selectAllPayments } from '@/store/payments/paymentsSelectors'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { selectAllCategories } from '@/store/categories/categoriesSelectors'
import { AccountType, PaymentKind, PaymentStatus, MovementType } from '@/typings/domain/enums'
import { resolvePaymentDisplayDate } from '@/utils/domain/resolvePaymentDisplayDate'
import { allocateCardPayments } from '@/utils/domain/computeCardDebts'
import { resolveCardMovementCycle } from '@/utils/domain/resolveCardMovementCycle'
import { resolveMovementConcept } from '@/utils/domain/resolveMovementConcept'
import { isFinalInstallmentPayment } from '@/utils/domain/isFinalInstallmentPayment'
import { computeNextClosingDate } from '@/utils/domain/computeNextClosingDate'
import { computeNextDueDate } from '@/utils/domain/computeNextDueDate'
import { buildCalendarWeeks } from './buildCalendarWeeks'
import { CalendarBadgeKind, CalendarEventKind } from './typings/enums'
import type {
  CalendarData,
  CalendarDayBadge,
  CalendarDayEvent,
  FinalInstallmentSummary
} from './typings/types'

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
    const remainingById = allocateCardPayments(accounts, movements)

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
    const looseMovements = movements
      .filter((movement) => movement.type !== MovementType.INCOME && movement.paymentId == null)
      .map((movement) => {
        const cycle = resolveCardMovementCycle(
          movement,
          accountsById.get(movement.accountId),
          remainingById,
          today
        )
        return {
          movement,
          cycle,
          displayDate: cycle?.displayDate ?? movement.date
        }
      })
    const looseMovementsThisMonth = looseMovements.filter((entry) =>
      entry.displayDate.startsWith(currentMonth)
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
    looseMovementsThisMonth.forEach(({ movement, cycle, displayDate }) => {
      pushEvent(displayDate, {
        kind:
          cycle?.status === PaymentStatus.PENDING
            ? CalendarEventKind.PENDING
            : CalendarEventKind.PAID,
        amount: movement.amount,
        label: resolveMovementConcept(movement, payments, categories)
      })
    })

    const badgesByIsoDate = new Map<string, CalendarDayBadge[]>()
    const pushBadge = (isoDate: string, badge: CalendarDayBadge): void => {
      const existing = badgesByIsoDate.get(isoDate)
      if (existing) {
        existing.push(badge)
      } else {
        badgesByIsoDate.set(isoDate, [badge])
      }
    }

    const cardPaymentPeriodIsoDates = new Set<string>()

    accounts
      .filter(
        (account) =>
          account.type === AccountType.CREDIT_CARD && account.closingDay && account.dueDay
      )
      .forEach((account) => {
        const closingIso = computeNextClosingDate(account.closingDay as number, today)
        const dueIso = computeNextDueDate(closingIso, account.dueDay as number)

        if (closingIso.startsWith(currentMonth)) {
          const paymentsTotal = paymentsWithDisplayDate
            .filter(
              (payment) =>
                payment.accountId === account.id &&
                payment.displayDate === closingIso &&
                payment.kind !== PaymentKind.DEPOSIT
            )
            .reduce((sum, payment) => sum + payment.amount, 0)
          const total = looseMovements
            .filter(
              (entry) =>
                entry.cycle != null &&
                entry.movement.accountId === account.id &&
                entry.displayDate === closingIso
            )
            .reduce((sum, entry) => sum + entry.movement.amount, paymentsTotal)
          pushBadge(closingIso, {
            kind: CalendarBadgeKind.CARD_CLOSING,
            label: `Cierre de tarjeta · ${account.name}`,
            amount: total,
            accountId: account.id,
            accountName: account.name,
            dueDate: dueIso
          })
        }

        if (dueIso.startsWith(currentMonth)) {
          pushBadge(dueIso, {
            kind: CalendarBadgeKind.CARD_DUE,
            label: `Vencimiento de tarjeta · ${account.name}`
          })
        }

        eachDayOfInterval({
          start: addDays(parseISO(closingIso), 1),
          end: subDays(parseISO(dueIso), 1)
        })
          .map((date) => format(date, 'yyyy-MM-dd'))
          .filter((isoDate) => isoDate.startsWith(currentMonth))
          .forEach((isoDate) => cardPaymentPeriodIsoDates.add(isoDate))
      })

    eventsByIsoDate.forEach((events, isoDate) => {
      if (events.some((event) => event.kind === CalendarEventKind.INCOME)) {
        pushBadge(isoDate, { kind: CalendarBadgeKind.INCOME, label: 'Ingreso' })
      }
    })

    const weeks = buildCalendarWeeks(
      referenceDate,
      today,
      eventsByIsoDate,
      badgesByIsoDate,
      cardPaymentPeriodIsoDates
    )

    const expensesThisMonth = paymentsThisMonth.filter(
      (payment) => payment.kind !== PaymentKind.DEPOSIT
    )
    const cardMovementsThisMonth = looseMovementsThisMonth.filter((entry) => entry.cycle != null)
    const totalDue =
      expensesThisMonth.reduce((total, payment) => total + payment.amount, 0) +
      cardMovementsThisMonth.reduce((total, entry) => total + entry.movement.amount, 0)
    const paidSoFar =
      expensesThisMonth
        .filter((payment) => payment.status === PaymentStatus.PAID)
        .reduce((total, payment) => total + payment.amount, 0) +
      cardMovementsThisMonth
        .filter((entry) => entry.cycle?.status === PaymentStatus.PAID)
        .reduce((total, entry) => total + entry.movement.amount, 0)

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
      monthLabel: format(referenceDate, "MMMM 'de' yyyy", { locale: es }),
      progress: {
        totalDue,
        paidSoFar,
        progressPercent: totalDue > 0 ? Math.min(100, Math.round((paidSoFar / totalDue) * 100)) : 0
      },
      finalInstallmentPayments
    }
  }, [payments, movements, accounts, categories, monthOffset])
}
