import type { Movement } from '@/typings/domain/types'
import type { MovementType } from '@/typings/domain/enums'

export function checkDuplicateRow(
  existingMovements: Movement[],
  candidate: { date: string; amount: number; type: MovementType; accountId: string }
): boolean {
  return existingMovements.some(
    (movement) =>
      movement.date === candidate.date &&
      Math.abs(movement.amount) === Math.abs(candidate.amount) &&
      movement.type === candidate.type &&
      movement.accountId === candidate.accountId
  )
}
