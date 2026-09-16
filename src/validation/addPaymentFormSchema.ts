import { z } from 'zod'
import { AmountMode, OwnerType, PaymentFrequency, PaymentKind } from '@/typings/domain/enums'

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
    amount: z.coerce
      .number({ message: 'Ingresá un monto' })
      .nonnegative('El monto no puede ser negativo'),
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
