import type { z } from 'zod'
import type { quickAddFormSchema } from '@/validation/quickAddFormSchema'
import type { MovementType } from '@/typings/domain/enums'
import type { QuickAddStep } from './enums'

export type QuickAddFormValues = z.infer<typeof quickAddFormSchema>

export type UseQuickAddFormResult = {
  step: QuickAddStep
  chooseType: (type: MovementType) => void
  goBackToChooseType: () => void
  submit: (values: QuickAddFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
  selectedType: MovementType | null
}
