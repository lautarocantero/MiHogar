import { MovementType } from '@/typings/domain/enums'

const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  [MovementType.EXPENSE]: 'Gasto',
  [MovementType.INCOME]: 'Ingreso',
  [MovementType.TRANSFER]: 'Transferencia',
  [MovementType.CARD_PAYMENT]: 'Pago de tarjeta'
}

export function resolveMovementTypeLabel(type: MovementType): string {
  return MOVEMENT_TYPE_LABELS[type]
}
