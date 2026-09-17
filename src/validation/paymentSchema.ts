import { z } from 'zod'
import {
  AmountMode,
  OwnerType,
  PaymentFrequency,
  PaymentKind,
  PaymentStatus
} from '@/typings/domain/enums'

export const attachmentMetaSchema = z.object({
  id: z.string().min(1),
  paymentId: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().nonnegative(),
  relativePath: z.string().min(1),
  createdAt: z.string()
})

export const paymentCredentialsSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  clientNumber: z.string().optional()
})

export const paymentSchema = z.object({
  id: z.string().min(1),
  concept: z.string().min(1),
  entity: z.string().min(1),
  accountId: z.string().min(1),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional(),
  recurring: z.boolean(),
  frequency: z.nativeEnum(PaymentFrequency).optional(),
  dueDate: z.string(),
  amount: z.number(),
  status: z.nativeEnum(PaymentStatus),
  categoryId: z.string().min(1),
  installmentsTotal: z.number().int().min(1).optional(),
  installmentsPaid: z.number().int().min(0).optional(),
  /** @deprecated legacy field, kept only so old saved vault files still parse. Use installmentsTotal/installmentsPaid instead. */
  installmentsRemaining: z.number().int().min(0).optional(),
  providerUrl: z.string().url().optional(),
  credentials: paymentCredentialsSchema.optional(),
  attachments: z.array(attachmentMetaSchema),
  reminderEnabled: z.boolean().optional(),
  kind: z.nativeEnum(PaymentKind).default(PaymentKind.EXPENSE),
  amountMode: z.nativeEnum(AmountMode).default(AmountMode.FIXED)
})
