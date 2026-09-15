import { MovementType } from '@/typings/domain/enums'

const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  [MovementType.EXPENSE]: 'Gasto',
  [MovementType.INCOME]: 'Ingreso',
  [MovementType.TRANSFER]: 'Transferencia'
}

export function resolveMovementTypeLabel(type: MovementType): string {
  return MOVEMENT_TYPE_LABELS[type]
}
