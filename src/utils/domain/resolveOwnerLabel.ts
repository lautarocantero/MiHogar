import type { HouseholdMember } from '@/typings/domain/types'
import { OwnerType } from '@/typings/domain/enums'

export function resolveOwnerLabel(
  ownerType: OwnerType,
  ownerId: string | undefined,
  members: HouseholdMember[]
): string {
  if (ownerType === OwnerType.HOUSEHOLD) {
    return 'Hogar'
  }
  return members.find((member) => member.id === ownerId)?.name ?? 'Sin asignar'
}
