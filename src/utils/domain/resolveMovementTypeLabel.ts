import { t } from '@/i18n'
import type { MovementType } from '@/typings/domain/enums'

export function resolveMovementTypeLabel(type: MovementType): string {
  return t(`format.movementType.${type}`)
}
