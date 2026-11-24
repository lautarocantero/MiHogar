import { z } from 'zod'
import { DebtDirection, OwnerType, PaymentFrequency } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addDebtFormSchema = z
  .object({
    direction: z.nativeEnum(DebtDirection),
    name: z.string().min(1, 'validation.nameRequired'),
    counterparty: z.string().min(1, 'validation.counterpartyRequired'),
    principal: numberField(z.number({ message: 'validation.amountRequired' }).nonnegative()),
    outstandingBalance: numberField(
      z.number({ message: 'validation.outstandingBalanceRequired' }).nonnegative()
    ),
    rateAnnual: numberField(z.number().nonnegative().optional()),
    installmentAmount: numberField(z.number().nonnegative().optional()),
    installmentsTotal: numberField(z.number().int().min(1).optional()),
    installmentsPaid: numberField(z.number().int().min(0).optional()),
    frequency: z.nativeEnum(PaymentFrequency).optional(),
    nextInstallmentDate: z.string().optional(),
    startDate: z.string().optional(),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional(),
    reminderEnabled: z.boolean(),
    notes: z.string().optional()
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'validation.ownerRequired',
    path: ['ownerId']
  })
