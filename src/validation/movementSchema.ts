import { z } from 'zod'
import { MovementType, OwnerType } from '@/typings/domain/enums'

export const movementSchema = z.object({
  id: z.string().min(1),
  type: z.nativeEnum(MovementType),
  amount: z.number(),
  date: z.string(),
  accountId: z.string().min(1),
  toAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  paymentId: z.string().optional(),
  note: z.string().optional()
})
