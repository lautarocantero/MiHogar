import { z } from 'zod'
import { OwnerType } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addSavingsGoalFormSchema = z
  .object({
    name: z.string().min(1, 'validation.nameRequired'),
    icon: z.string().min(1),
    targetAmount: numberField(z.number({ message: 'validation.targetAmountRequired' }).positive()),
    currentAmount: numberField(z.number({ message: 'validation.currentAmountRequired' }).nonnegative()),
    targetDate: z.string().optional(),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'validation.ownerRequired',
    path: ['ownerId']
  })
