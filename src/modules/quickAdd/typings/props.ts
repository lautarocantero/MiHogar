import type { MovementType } from '@/typings/domain/enums'
import type { QuickAddFormValues } from './types'

export type QuickAddModalProps = {
  open: boolean
  onClose: () => void
}

export type StepChooseTypeProps = {
  onChoose: (type: MovementType) => void
}

export type StepAmountAndDetailsProps = {
  type: MovementType
  onSubmit: (values: QuickAddFormValues) => void
  onBack: () => void
  isSubmitting: boolean
  errorMessage: string | null
}
