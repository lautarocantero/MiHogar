import { z } from 'zod'
import { taskCategorySchema } from './taskCategorySchema'
import { taskSchema } from './taskSchema'

export const tasksFileSchema = z.object({
  version: z.literal(1),
  tasks: z.array(taskSchema).default([]),
  categories: z.array(taskCategorySchema).default([]),
  nextSeq: z.number().int().nonnegative().default(0)
})
