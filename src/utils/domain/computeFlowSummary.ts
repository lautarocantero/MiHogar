import type { FlowSummary, Movement } from '@/typings/domain/types'
import { MovementType } from '@/typings/domain/enums'

export function computeFlowSummary(movements: Movement[]): FlowSummary {
  const totalIn = movements
    .filter((movement) => movement.type === MovementType.INCOME)
    .reduce((total, movement) => total + movement.amount, 0)
  const totalOut = movements
    .filter((movement) => movement.type === MovementType.EXPENSE)
    .reduce((total, movement) => total + movement.amount, 0)

  return { totalIn, totalOut, difference: totalIn - totalOut }
}
