import { z } from 'zod'
import { boundedNumber } from './zodNumberField'

export const savingsSnapshotSchema = z.object({
  id: z.string().regex(/^\d{4}-\d{2}$/),
  monthKey: z.string().regex(/^\d{4}-\d{2}$/),
  totalSaved: boundedNumber().nonnegative(),
  totalInvested: boundedNumber().nonnegative()
})
