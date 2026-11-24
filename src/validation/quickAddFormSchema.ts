import { z } from 'zod'
import { Currency, MovementType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

const SECONDARY_ACCOUNT_TYPES = [MovementType.TRANSFER, MovementType.CARD_PAYMENT]

export const quickAddFormSchema = z
  .object({
    type: z.nativeEnum(MovementType),
    amount: numberField(
      z.number({ message: 'validation.amountRequired' }).positive('validation.amountMustBePositive')
    ),
    currency: z.nativeEnum(Currency).optional(),
    date: z.string().min(1, 'validation.dateRequired'),
    categoryId: z.string().optional(),
    accountId: z.string().min(1, 'validation.accountRequired'),
    toAccountId: z.string().optional(),
    note: z.string().optional()
  })
  .refine((data) => SECONDARY_ACCOUNT_TYPES.includes(data.type) || Boolean(data.categoryId), {
    message: 'validation.movementCategoryRequired',
    path: ['categoryId']
  })
  .refine((data) => !SECONDARY_ACCOUNT_TYPES.includes(data.type) || Boolean(data.toAccountId), {
    message: 'validation.toAccountRequired',
    path: ['toAccountId']
  })
  .refine(
    (data) =>
      !SECONDARY_ACCOUNT_TYPES.includes(data.type) ||
      !data.toAccountId ||
      data.toAccountId !== data.accountId,
    { message: 'validation.differentAccountsRequired', path: ['toAccountId'] }
  )
