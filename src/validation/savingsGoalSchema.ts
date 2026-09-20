import { z } from 'zod'
import { OwnerType } from '@/typings/domain/enums'

export const savingsGoalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative(),
  targetDate: z.string().optional(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  colorTag: z.string().optional()
})
