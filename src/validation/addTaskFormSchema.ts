import { z } from 'zod'
import { TaskSeverity } from '@/typings/domain/enums'

export const addTaskFormSchema = z
  .object({
    title: z.string().min(1, 'Ingresá un título').max(200),
    description: z.string().max(20000).optional(),
    severity: z.nativeEnum(TaskSeverity),
    categoryIds: z.array(z.string().min(1)).max(10).default([]),
    startDate: z.string().optional(),
    dueDate: z.string().optional()
  })
  .refine((data) => !data.startDate || !data.dueDate || data.startDate <= data.dueDate, {
    message: 'La fecha de inicio no puede ser posterior a la fecha límite',
    path: ['dueDate']
  })

export type AddTaskFormValues = z.infer<typeof addTaskFormSchema>
