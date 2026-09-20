import { z } from 'zod'
import { AccountType, OwnerType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addAccountFormSchema = z
  .object({
    name: z.string().min(1, 'Ingresá un nombre para la cuenta'),
    type: z.nativeEnum(AccountType, { message: 'Elegí un tipo de cuenta' }),
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
    message: 'Elegí quién es el dueño de la cuenta',
    path: ['ownerId']
  })
  .superRefine((data, ctx) => {
    if (data.type === AccountType.CREDIT_CARD) {
      if (!data.sourceAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Elegí de qué cuenta sale la plata',
          path: ['sourceAccountId']
        })
      }
      if (typeof data.creditLimit !== 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ingresá el límite de la tarjeta',
          path: ['creditLimit']
        })
      }
      return
    }
    if (typeof data.balance !== 'number') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingresá un monto',
        path: ['balance']
      })
    }
  })
