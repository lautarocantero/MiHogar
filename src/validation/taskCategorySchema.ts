import { z } from 'zod'

export const taskCategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(60),
  color: z.string().min(1)
})
