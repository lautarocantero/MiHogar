import { z } from 'zod'
import { AccountType, OwnerType } from '@/typings/domain/enums'

export const addAccountFormSchema = z
  .object({
    name: z.string().min(1, 'Ingresá un nombre para la cuenta'),
    type: z.nativeEnum(AccountType, { message: 'Elegí un tipo de cuenta' }),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional(),
    balance: z.coerce.number({ message: 'Ingresá un monto' }),
    contextPhrase: z.string().optional(),
    closingDay: z.coerce.number().int().min(1).max(31).optional(),
    dueDay: z.coerce.number().int().min(1).max(31).optional(),
    installmentsRemaining: z.coerce.number().int().min(0).optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'Elegí quién es el dueño de la cuenta',
    path: ['ownerId']
  })
