import { z } from 'zod'
import { boundedNumber } from './zodNumberField'
import { Currency, MovementType, OwnerType } from '@/typings/domain/enums'

export const movementSchema = z.object({
  id: z.string().min(1),
  type: z.nativeEnum(MovementType),
  amount: boundedNumber(),
  currency: z.nativeEnum(Currency).optional(),
  date: z.string(),
  accountId: z.string().min(1),
  toAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  paymentId: z.string().optional(),
  note: z.string().optional(),
  isImported: z.boolean().optional()
})
