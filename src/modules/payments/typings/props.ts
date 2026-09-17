import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { Payment } from '@/typings/domain/types'
import type { AmountMode, OwnerType, PaymentKind } from '@/typings/domain/enums'
import type { PaymentFilter, PaymentMethodFilter } from './enums'
import type {
  AddPaymentFormValues,
  EditCredentialsFormValues,
  PaymentHistoryData,
  PaymentView,
  UnlockCredentialsFormValues
} from './types'

export type PaymentRowProps = {
  payment: PaymentView
  onEdit: () => void
  onDelete: () => void
}

export type PaymentFormFieldsProps = {
  register: UseFormRegister<AddPaymentFormValues>
  control: Control<AddPaymentFormValues>
  setValue: UseFormSetValue<AddPaymentFormValues>
  errors: FieldErrors<AddPaymentFormValues>
  selectedOwnerType: OwnerType
  isRecurring: boolean
  kind: PaymentKind
  selectedAmountMode: AmountMode
  hasInstallments: boolean
  onToggleInstallments: (checked: boolean) => void
}

export type EditPaymentFormProps = {
  payment: Payment
  onSubmit: (values: AddPaymentFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type EditPaymentDialogProps = {
  payment: Payment
  open: boolean
  onClose: () => void
}

export type DeletePaymentDialogProps = {
  payment: Payment
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

export type PaymentFilterPillsProps = {
  activeFilter: PaymentFilter
  pendingCount: number
  paidCount: number
  totalCount: number
  onChange: (filter: PaymentFilter) => void
}

export type PaymentMethodPillsProps = {
  activeMethod: PaymentMethodFilter
  onChange: (method: PaymentMethodFilter) => void
}

export type AddPaymentFormProps = {
  kind: PaymentKind
  onSubmit: (values: AddPaymentFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddPaymentDialogProps = {
  kind: PaymentKind
  open: boolean
  onClose: () => void
}

export type SectionLockGateProps = {
  isUnlocked: boolean
  onSubmit: (values: UnlockCredentialsFormValues) => void
  onHide: () => void
  isVerifying: boolean
  errorMessage: string | null
  children: React.ReactNode
}

export type CredentialsPanelProps = {
  credentials: Payment['credentials']
}

export type AttachmentListProps = {
  payment: PaymentView
}

export type AttachmentItemProps = {
  attachment: Payment['attachments'][number]
  onOpen: (relativePath: string) => void
  onRemove: (attachmentId: string, relativePath: string) => void
}

export type AttachmentTypeIconProps = {
  mimeType: string
}

export type PaymentHistoryCardProps = {
  history: PaymentHistoryData
}

export type EditCredentialsFormProps = {
  payment: PaymentView
  onSubmit: (values: EditCredentialsFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type EditCredentialsDialogProps = {
  payment: PaymentView
  open: boolean
  onClose: () => void
}
