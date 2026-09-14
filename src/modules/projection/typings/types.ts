import type { ProjectionPoint } from '@/typings/domain/types'

export type ProjectionData = {
  series: ProjectionPoint[]
  todayBalance: number
  pendingTotal: number
  expectedIncome: number
  endOfMonthBalance: number
  endOfMonthLabel: string
  isPositive: boolean
}
