import { z } from 'zod'
import { boundedNumber } from './zodNumberField'
import { OwnerType } from '@/typings/domain/enums'

export const savingsGoalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
  targetAmount: boundedNumber().positive(),
  currentAmount: boundedNumber().nonnegative(),
  targetDate: z.string().optional(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  colorTag: z.string().optional()
})
