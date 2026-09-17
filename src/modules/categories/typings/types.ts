import type { z } from 'zod'
import type { addCategoryFormSchema } from '@/validation/addCategoryFormSchema'

export type AddCategoryFormValues = z.infer<typeof addCategoryFormSchema>

export type UseAddCategoryResult = {
  submit: (values: AddCategoryFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}
