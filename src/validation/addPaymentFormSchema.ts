import { z } from 'zod'
import { AmountMode, OwnerType, PaymentFrequency, PaymentKind } from '@/typings/domain/enums'
import { numberField } from './zodNumberField'

export const addPaymentFormSchema = z
  .object({
    concept: z.string().min(1, 'Ingresá qué es lo que se paga'),
    entity: z.string().min(1, 'Ingresá la empresa o entidad'),
    accountId: z.string().min(1, 'Elegí con qué cuenta se paga'),
    categoryId: z.string().min(1, 'Elegí una categoría'),
    ownerType: z.nativeEnum(OwnerType),
    ownerId: z.string().optional(),
    recurring: z.boolean(),
    frequency: z.nativeEnum(PaymentFrequency).optional(),
    dueDate: z.string().min(1, 'Elegí la fecha de vencimiento'),
    amount: numberField(
      z.number({ message: 'Ingresá un monto' }).nonnegative('El monto no puede ser negativo')
    ),
    installmentsTotal: numberField(z.number().int().min(1).optional()),
    installmentsPaid: numberField(z.number().int().min(0).optional()),
    kind: z.nativeEnum(PaymentKind).default(PaymentKind.EXPENSE),
    amountMode: z.nativeEnum(AmountMode).default(AmountMode.FIXED)
  })
  .refine((data) => data.ownerType !== OwnerType.MEMBER || Boolean(data.ownerId), {
    message: 'Elegí quién es el dueño del pago',
    path: ['ownerId']
  })
  .refine((data) => data.amountMode !== AmountMode.FIXED || data.amount > 0, {
    message: 'Ingresá un monto mayor a 0',
    path: ['amount']
  })
  .refine(
    (data) =>
      typeof data.installmentsTotal !== 'number' ||
      typeof data.installmentsPaid !== 'number' ||
      data.installmentsPaid <= data.installmentsTotal,
    {
      message: 'No puede haber más cuotas pagadas que el total',
      path: ['installmentsPaid']
    }
  )
