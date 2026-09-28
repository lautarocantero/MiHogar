import { z } from 'zod'
import { isValid, parseISO } from 'date-fns'
import { MovementType, OwnerType } from '@/typings/domain/enums'

function isValidCalendarDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value))
}

export const parsedStatementRowSchema = z.object({
  date: z.string().refine(isValidCalendarDate, { message: 'Fecha inválida' }),
  amount: z
    .number()
    .finite()
    .refine((value) => value !== 0, { message: 'Monto no puede ser 0' }),
  description: z.string().min(1),
  sourceRef: z.string().optional()
})

export type ParsedStatementRow = z.infer<typeof parsedStatementRowSchema>

export const confirmedStatementRowSchema = parsedStatementRowSchema.extend({
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  type: z.nativeEnum(MovementType),
  ownerType: z.nativeEnum(OwnerType),
  ownerId: z.string().optional()
})

export type ConfirmedStatementRow = z.infer<typeof confirmedStatementRowSchema>
