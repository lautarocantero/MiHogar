import type { Category, Movement, Payment } from '@/typings/domain/types'
import { resolveMovementTypeLabel } from './resolveMovementTypeLabel'

export function resolveMovementConcept(
  movement: Movement,
  payments: Payment[],
  categories: Category[]
): string {
  if (movement.note) {
    return movement.note
  }
  if (movement.paymentId) {
    const payment = payments.find((candidate) => candidate.id === movement.paymentId)
    if (payment) {
      return payment.concept
    }
  }
  if (movement.categoryId) {
    const category = categories.find((candidate) => candidate.id === movement.categoryId)
    if (category) {
      return category.name
    }
  }
  return resolveMovementTypeLabel(movement.type)
}
