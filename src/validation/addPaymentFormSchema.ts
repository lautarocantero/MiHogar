import { z } from 'zod'
import { AmountMode, OwnerType, PaymentFrequency, PaymentKind } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addPaymentFormSchema = z
  .object({
    concept: z.string().min(1, 'validation.conceptRequired'),
    entity: z.string().min(1, 'validation.entityRequired'),
    accountId: z.string().min(1, 'validation.paymentAccountRequired'),
    categoryId: z.string().min(1, 'validation.categoryRequired'),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional(),
    recurring: z.boolean(),
    frequency: z.nativeEnum(PaymentFrequency).optional(),
    dueDate: z.string().min(1, 'validation.dueDateRequired'),
    amount: numberField(
      z.number({ message: 'validation.amountRequired' }).nonnegative('validation.amountNotNegative')
    ),
    installmentsTotal: numberField(z.number().int().min(1).optional()),
    installmentsPaid: numberField(z.number().int().min(0).optional()),
    kind: z.nativeEnum(PaymentKind).default(PaymentKind.EXPENSE),
    amountMode: z.nativeEnum(AmountMode).default(AmountMode.FIXED)
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'validation.paymentOwnerRequired',
    path: ['ownerId']
  })
  .refine((data) => data.amountMode !== AmountMode.FIXED || data.amount > 0, {
    message: 'validation.amountGreaterThanZero',
    path: ['amount']
  })
  .refine(
    (data) =>
      typeof data.installmentsTotal !== 'number' ||
      typeof data.installmentsPaid !== 'number' ||
      data.installmentsPaid <= data.installmentsTotal,
    {
      message: 'validation.installmentsPaidExceedTotal',
      path: ['installmentsPaid']
    }
  )
