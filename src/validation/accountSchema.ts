import { z } from 'zod'
import { boundedNumber } from './zodNumberField'
import { AccountType, Currency, OwnerType } from '@/typings/domain/enums'

export const accountSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(AccountType),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  balance: boundedNumber(),
  currency: z.nativeEnum(Currency).default(Currency.ARS),
  contextPhrase: z.string().optional(),
  sourceAccountId: z.string().optional(),
  creditLimit: boundedNumber().optional(),
  usedAmount: boundedNumber().nonnegative().optional(),
  closingDay: boundedNumber().int().min(1).max(31).optional(),
  dueDay: boundedNumber().int().min(1).max(31).optional(),
  nextClosingDay: boundedNumber().int().min(1).max(31).optional(),
  nextDueDay: boundedNumber().int().min(1).max(31).optional(),
  minPayment: boundedNumber().nonnegative().optional(),
  minPaymentDueDate: z.string().optional(),
  color: z.string().optional(),
  sortOrder: boundedNumber().optional()
})
