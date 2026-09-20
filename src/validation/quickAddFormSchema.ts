import { z } from 'zod'
import { Currency, MovementType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

const SECONDARY_ACCOUNT_TYPES = [MovementType.TRANSFER, MovementType.CARD_PAYMENT]

export const quickAddFormSchema = z
  .object({
    type: z.nativeEnum(MovementType),
    amount: numberField(
      z.number({ message: 'Ingresá un monto' }).positive('El monto debe ser mayor a 0')
    ),
    currency: z.nativeEnum(Currency).optional(),
    date: z.string().min(1, 'Elegí el día'),
    categoryId: z.string().optional(),
    accountId: z.string().min(1, 'Elegí una cuenta'),
    toAccountId: z.string().optional(),
    note: z.string().optional()
  })
  .refine((data) => SECONDARY_ACCOUNT_TYPES.includes(data.type) || Boolean(data.categoryId), {
    message: 'Elegí de qué fue',
    path: ['categoryId']
  })
  .refine((data) => !SECONDARY_ACCOUNT_TYPES.includes(data.type) || Boolean(data.toAccountId), {
    message: 'Elegí a qué cuenta entra',
    path: ['toAccountId']
  })
  .refine(
    (data) =>
      !SECONDARY_ACCOUNT_TYPES.includes(data.type) ||
      !data.toAccountId ||
      data.toAccountId !== data.accountId,
    { message: 'Elegí dos cuentas distintas', path: ['toAccountId'] }
  )
