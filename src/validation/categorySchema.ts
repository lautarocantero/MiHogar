import { z } from 'zod'
import { CategoryKind } from '@/typings/domain/enums'

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.nativeEnum(CategoryKind),
  colorTag: z.string().optional()
})
