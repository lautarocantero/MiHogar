import { z } from 'zod'
import { MovementType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const quickAddFormSchema = z
  .object({
    type: z.nativeEnum(MovementType),
    amount: numberField(
      z.number({ message: 'Ingresá un monto' }).positive('El monto debe ser mayor a 0')
    ),
    date: z.string().min(1, 'Elegí el día'),
    categoryId: z.string().optional(),
    accountId: z.string().min(1, 'Elegí una cuenta'),
    toAccountId: z.string().optional(),
    note: z.string().optional()
  })
  .refine((data) => data.type === MovementType.TRANSFER || Boolean(data.categoryId), {
    message: 'Elegí de qué fue',
    path: ['categoryId']
  })
  .refine((data) => data.type !== MovementType.TRANSFER || Boolean(data.toAccountId), {
    message: 'Elegí a qué cuenta entra',
    path: ['toAccountId']
  })
  .refine(
    (data) =>
      data.type !== MovementType.TRANSFER ||
      !data.toAccountId ||
      data.toAccountId !== data.accountId,
    { message: 'Elegí dos cuentas distintas', path: ['toAccountId'] }
  )
