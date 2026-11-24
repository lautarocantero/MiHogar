import { z } from 'zod'
import { AccountType, Currency, OwnerType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addAccountFormSchema = z
  .object({
    name: z.string().min(1, 'validation.accountNameRequired'),
    type: z.nativeEnum(AccountType, { message: 'validation.accountTypeRequired' }),
    currency: z.nativeEnum(Currency).default(Currency.ARS),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional(),
    balance: numberField(z.number().optional()),
    contextPhrase: z.string().optional(),
    sourceAccountId: z.string().optional(),
    creditLimit: numberField(z.number().optional()),
    usedAmount: numberField(z.number().nonnegative().optional()),
    closingDay: numberField(z.number().int().min(1).max(31).optional()),
    dueDay: numberField(z.number().int().min(1).max(31).optional()),
    nextClosingDay: numberField(z.number().int().min(1).max(31).optional()),
    nextDueDay: numberField(z.number().int().min(1).max(31).optional()),
    color: z.string().optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'validation.accountOwnerRequired',
    path: ['ownerId']
  })
  .superRefine((data, ctx) => {
    if (data.type === AccountType.CREDIT_CARD) {
      if (!data.sourceAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.sourceAccountRequired',
          path: ['sourceAccountId']
        })
      }
      if (typeof data.creditLimit !== 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'validation.creditLimitRequired',
          path: ['creditLimit']
        })
      }
      return
    }
    if (typeof data.balance !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'validation.amountRequired',
        path: ['balance']
      })
    }
  })
