import { z } from 'zod'
import { AccountType, OwnerType } from '@/typings/domain/enums'

export const accountSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(AccountType),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  balance: z.number(),
  contextPhrase: z.string().optional(),
  sourceAccountId: z.string().optional(),
  creditLimit: z.number().optional(),
  usedAmount: z.number().nonnegative().optional(),
  closingDay: z.number().int().min(1).max(31).optional(),
  dueDay: z.number().int().min(1).max(31).optional(),
  nextClosingDay: z.number().int().min(1).max(31).optional(),
  nextDueDay: z.number().int().min(1).max(31).optional(),
  color: z.string().optional(),
  sortOrder: z.number().optional()
})
