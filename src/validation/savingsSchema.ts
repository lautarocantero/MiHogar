import { z } from 'zod'
import { boundedNumber } from './zodNumberField'
import { OwnerType } from '@/typings/domain/enums'

export const savingsInstrumentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  principal: boundedNumber().nonnegative(),
  monthlyInterestEstimate: boundedNumber().optional(),
  rateAnnual: boundedNumber().optional(),
  maturityDate: z.string().optional(),
  liquidAnytime: z.boolean(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  colorTag: z.string().optional()
})
