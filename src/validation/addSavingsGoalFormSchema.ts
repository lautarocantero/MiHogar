import { z } from 'zod'
import { OwnerType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addSavingsGoalFormSchema = z
  .object({
    name: z.string().min(1, 'Ingresá un nombre'),
    icon: z.string().min(1),
    targetAmount: numberField(z.number({ message: 'Ingresá un monto objetivo' }).positive()),
    currentAmount: numberField(z.number({ message: 'Ingresá el monto ya ahorrado' }).nonnegative()),
    targetDate: z.string().optional(),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'Elegí quién es el dueño',
    path: ['ownerId']
  })
