import { z } from 'zod'
import { OwnerType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addSavingsFormSchema = z
  .object({
    name: z.string().min(1, 'validation.nameRequired'),
    principal: numberField(z.number({ message: 'validation.amountRequired' }).nonnegative()),
    monthlyInterestEstimate: numberField(z.number().nonnegative().optional()),
    rateAnnual: numberField(z.number().nonnegative().optional()),
    maturityDate: z.string().optional(),
    liquidAnytime: z.boolean(),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'validation.ownerRequired',
    path: ['ownerId']
  })
