import { z } from 'zod'
import { OwnerType } from '@/typings/domain/enums'

export const addSavingsFormSchema = z
  .object({
    name: z.string().min(1, 'Ingresá un nombre'),
    principal: z.coerce.number({ message: 'Ingresá un monto' }).nonnegative(),
    monthlyInterestEstimate: z.coerce.number().optional(),
    rateAnnual: z.coerce.number().optional(),
    maturityDate: z.string().optional(),
    liquidAnytime: z.boolean(),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'Elegí quién es el dueño',
    path: ['ownerId']
  })
