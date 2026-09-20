import { z } from 'zod'

export const savingsSnapshotSchema = z.object({
  id: z.string().regex(/^\d{4}-\d{2}$/),
  monthKey: z.string().regex(/^\d{4}-\d{2}$/),
  totalSaved: z.number().nonnegative(),
  totalInvested: z.number().nonnegative()
})
