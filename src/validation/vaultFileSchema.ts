import { z } from 'zod'
import { householdMemberSchema, householdSchema } from './householdSchema'
import { accountSchema } from './accountSchema'
import { paymentSchema } from './paymentSchema'
import { movementSchema } from './movementSchema'
import { savingsInstrumentSchema } from './savingsSchema'
import { categorySchema } from './categorySchema'
import { readNotificationSchema } from './notificationSchema'
import { debtSchema } from './debtSchema'
import { savingsGoalSchema } from './savingsGoalSchema'
import { savingsSnapshotSchema } from './savingsSnapshotSchema'

export const vaultFileSchema = z.object({
  version: z.literal(1),
  household: householdSchema,
  members: z.array(householdMemberSchema),
  accounts: z.array(accountSchema),
  payments: z.array(paymentSchema),
  movements: z.array(movementSchema),
  savingsInstruments: z.array(savingsInstrumentSchema),
  categories: z.array(categorySchema),
  notifications: z.array(readNotificationSchema).default([]),
  debts: z.array(debtSchema).default([]),
  savingsGoals: z.array(savingsGoalSchema).default([]),
  savingsSnapshots: z.array(savingsSnapshotSchema).default([])
})
