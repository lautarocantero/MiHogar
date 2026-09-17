import type { CategoryKind } from '@/typings/domain/enums'
import type { AddCategoryFormValues } from './types'

export type AddCategoryFormProps = {
  onSubmit: (values: AddCategoryFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddCategoryDialogProps = {
  kind: CategoryKind
  open: boolean
  onClose: () => void
  onCreated?: (categoryId: string) => void
}
