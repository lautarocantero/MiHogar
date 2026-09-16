import { eachDayOfInterval, format } from 'date-fns'
import type { Movement, Payment, ProjectionPoint } from '@/typings/domain/types'

export function computeProjectionSeries(
  todayBalance: number,
  today: Date,
  monthEnd: Date,
  pendingPaymentsThisRange: Payment[],
  incomeMovementsThisRange: Movement[],
  pendingDepositsThisRange: Payment[] = []
): ProjectionPoint[] {
  const dueByDate = new Map<string, number>()
  pendingPaymentsThisRange.forEach((payment) => {
    dueByDate.set(payment.dueDate, (dueByDate.get(payment.dueDate) ?? 0) + payment.amount)
  })

  const incomeByDate = new Map<string, number>()
  incomeMovementsThisRange.forEach((movement) => {
    incomeByDate.set(movement.date, (incomeByDate.get(movement.date) ?? 0) + movement.amount)
  })
  pendingDepositsThisRange.forEach((payment) => {
    incomeByDate.set(payment.dueDate, (incomeByDate.get(payment.dueDate) ?? 0) + payment.amount)
  })

  let runningBalance = todayBalance

  return eachDayOfInterval({ start: today, end: monthEnd }).map((date) => {
    const isoDate = format(date, 'yyyy-MM-dd')
    runningBalance += (incomeByDate.get(isoDate) ?? 0) - (dueByDate.get(isoDate) ?? 0)
    return { isoDate, dayOfMonth: date.getDate(), balance: runningBalance }
  })
}
