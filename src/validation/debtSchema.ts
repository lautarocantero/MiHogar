import { z } from 'zod'
import { DebtDirection, DebtStatus, OwnerType, PaymentFrequency } from '@/typings/domain/enums'

export const debtSchema = z.object({
  id: z.string().min(1),
  direction: z.nativeEnum(DebtDirection),
  name: z.string().min(1),
  counterparty: z.string().min(1),
  principal: z.number().nonnegative(),
  outstandingBalance: z.number().nonnegative(),
  rateAnnual: z.number().nonnegative().optional(),
  installmentAmount: z.number().nonnegative().optional(),
  installmentsTotal: z.number().int().min(1).optional(),
  installmentsPaid: z.number().int().min(0).optional(),
  frequency: z.nativeEnum(PaymentFrequency).optional(),
  nextInstallmentDate: z.string().optional(),
  startDate: z.string().optional(),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  reminderEnabled: z.boolean().optional(),
  status: z.nativeEnum(DebtStatus),
  notes: z.string().optional()
})
