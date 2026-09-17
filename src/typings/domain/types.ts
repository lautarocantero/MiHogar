import type { z } from 'zod'
import type { householdMemberSchema, householdSchema } from '@/validation/householdSchema'
import type { accountSchema } from '@/validation/accountSchema'
import type {
  attachmentMetaSchema,
  paymentCredentialsSchema,
  paymentSchema
} from '@/validation/paymentSchema'
import type { movementSchema } from '@/validation/movementSchema'
import type { savingsInstrumentSchema } from '@/validation/savingsSchema'
import type { categorySchema } from '@/validation/categorySchema'
import type { readNotificationSchema } from '@/validation/notificationSchema'
import type { debtSchema } from '@/validation/debtSchema'
import type { vaultFileSchema } from '@/validation/vaultFileSchema'

export type Household = z.infer<typeof householdSchema>
export type HouseholdMember = z.infer<typeof householdMemberSchema>
export type Account = z.infer<typeof accountSchema>
export type AttachmentMeta = z.infer<typeof attachmentMetaSchema>
export type PaymentCredentials = z.infer<typeof paymentCredentialsSchema>
export type Payment = z.infer<typeof paymentSchema>
export type Movement = z.infer<typeof movementSchema>
export type SavingsInstrument = z.infer<typeof savingsInstrumentSchema>
export type Category = z.infer<typeof categorySchema>
export type ReadNotification = z.infer<typeof readNotificationSchema>
export type Debt = z.infer<typeof debtSchema>
export type VaultFile = z.infer<typeof vaultFileSchema>

export type FlowSummary = {
  totalIn: number
  totalOut: number
  difference: number
}

export type ProjectionPoint = {
  isoDate: string
  dayOfMonth: number
  balance: number
}

export type MonthlyExpensePoint = {
  monthKey: string
  monthLabel: string
  total: number
  isCurrentMonth: boolean
}

export type CategoryBreakdownEntry = {
  categoryId: string
  categoryName: string
  total: number
  percent: number
}

export type ExpenseComparison = {
  differenceAmount: number
  isIncrease: boolean
  topChangedCategoryNames: string[]
}
