import { z } from 'zod'
import { OwnerType } from '@/typings/domain/enums'

export const savingsInstrumentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  principal: z.number().nonnegative(),
  monthlyInterestEstimate: z.number().optional(),
  rateAnnual: z.number().optional(),
  maturityDate: z.string().optional(),
  liquidAnytime: z.boolean(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  colorTag: z.string().optional()
})
