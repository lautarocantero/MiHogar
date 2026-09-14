import { z } from 'zod'
import { householdMemberSchema, householdSchema } from './householdSchema'
import { accountSchema } from './accountSchema'
import { paymentSchema } from './paymentSchema'
import { movementSchema } from './movementSchema'
import { savingsInstrumentSchema } from './savingsSchema'
import { categorySchema } from './categorySchema'

export const vaultFileSchema = z.object({
  version: z.literal(1),
  household: householdSchema,
  members: z.array(householdMemberSchema),
  accounts: z.array(accountSchema),
  payments: z.array(paymentSchema),
  movements: z.array(movementSchema),
  savingsInstruments: z.array(savingsInstrumentSchema),
  categories: z.array(categorySchema)
})
