import { z } from 'zod'

export const categoryRuleSchema = z.object({
  id: z.string().min(1),
  descriptionKey: z.string().min(1),
  categoryId: z.string().min(1)
})
