import { z } from 'zod'
import { boundedNumber } from './zodNumberField'
import { isHttpUrl } from '@/utils/resolveUrlHostname'
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
  sizeBytes: boundedNumber().nonnegative(),
  relativePath: z.string().min(1),
  createdAt: z.string(),
  // Clave AES-256-GCM (base64) con la que se cifró el archivo en Storage. Los adjuntos
  // de la app de escritorio vieja no la tienen: quedaron en esa computadora.
  encryptionKey: z.string().min(1).optional()
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
  amount: boundedNumber(),
  status: z.nativeEnum(PaymentStatus),
  categoryId: z.string().min(1),
  installmentsTotal: boundedNumber().int().min(1).optional(),
  installmentsPaid: boundedNumber().int().min(0).optional(),
  /** @deprecated legacy field, kept only so old saved vault files still parse. Use installmentsTotal/installmentsPaid instead. */
  installmentsRemaining: boundedNumber().int().min(0).optional(),
  // Solo http/https (se usa como link). Uno inválido o `javascript:` se descarta en vez
  // de impedir que se abra el vault.
  providerUrl: z.preprocess(
    (value) => (typeof value === 'string' && !isHttpUrl(value) ? undefined : value),
    z.string().url().optional()
  ),
  credentials: paymentCredentialsSchema.optional(),
  attachments: z.array(attachmentMetaSchema),
  reminderEnabled: z.boolean().optional(),
  kind: z.nativeEnum(PaymentKind).default(PaymentKind.EXPENSE),
  amountMode: z.nativeEnum(AmountMode).default(AmountMode.FIXED)
})
