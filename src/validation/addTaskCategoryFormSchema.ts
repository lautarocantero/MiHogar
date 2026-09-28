import { z } from 'zod'

export const addTaskCategoryFormSchema = z.object({
  label: z.string().min(1, 'Ingresá un nombre').max(60),
  color: z.string().min(1, 'Elegí un color')
})

export type AddTaskCategoryFormValues = z.infer<typeof addTaskCategoryFormSchema>
