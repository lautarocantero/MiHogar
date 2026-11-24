import { z } from 'zod'
import { boundedNumber } from './zodNumberField'
import { DebtDirection, DebtStatus, OwnerType, PaymentFrequency } from '@/typings/domain/enums'

export const debtSchema = z.object({
  id: z.string().min(1),
  direction: z.nativeEnum(DebtDirection),
  name: z.string().min(1),
  counterparty: z.string().min(1),
  principal: boundedNumber().nonnegative(),
  outstandingBalance: boundedNumber().nonnegative(),
  rateAnnual: boundedNumber().nonnegative().optional(),
  installmentAmount: boundedNumber().nonnegative().optional(),
  installmentsTotal: boundedNumber().int().min(1).optional(),
  installmentsPaid: boundedNumber().int().min(0).optional(),
  frequency: z.nativeEnum(PaymentFrequency).optional(),
  nextInstallmentDate: z.string().optional(),
  startDate: z.string().optional(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  reminderEnabled: z.boolean().optional(),
  status: z.nativeEnum(DebtStatus),
  notes: z.string().optional()
})
