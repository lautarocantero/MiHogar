import type { z } from 'zod'
import type { Movement, Payment } from '@/typings/domain/types'
import type { addPaymentFormSchema } from '@/validation/addPaymentFormSchema'
import type { unlockFormSchema } from '@/validation/unlockFormSchema'
import type { editCredentialsFormSchema } from '@/validation/editCredentialsFormSchema'
import type { PaymentFilter } from './enums'

export type PaymentView = Payment & {
  accountName: string
  ownerLabel: string
  categoryName: string
}

export type UnlockCredentialsFormValues = z.infer<typeof unlockFormSchema>

export type UseUnlockCredentialsResult = {
  isUnlocked: boolean
  submit: (values: UnlockCredentialsFormValues) => void
  isVerifying: boolean
  errorMessage: string | null
  hide: () => void
}

export type PaymentHistoryEntry = {
  movement: Movement
  monthLabel: string
}

export type PaymentHistoryData = {
  entries: PaymentHistoryEntry[]
  comparativePhrase: string | null
}

export type UseMarkPaymentAsPaidResult = {
  markAsPaid: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseAttachmentsResult = {
  uploadFile: (file: File) => void
  openFile: (relativePath: string) => void
  removeFile: (attachmentId: string, relativePath: string) => void
  isLoading: boolean
  errorMessage: string | null
}

export type EditCredentialsFormValues = z.infer<typeof editCredentialsFormSchema>

export type UseUpdateCredentialsResult = {
  submit: (values: EditCredentialsFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddPaymentFormValues = z.infer<typeof addPaymentFormSchema>

export type UseCreatePaymentResult = {
  submit: (values: AddPaymentFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseUpdatePaymentResult = {
  submit: (values: AddPaymentFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseDeletePaymentResult = {
  submit: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UsePaymentFiltersResult = {
  activeFilter: PaymentFilter
  setActiveFilter: (filter: PaymentFilter) => void
  filteredPayments: PaymentView[]
  pendingCount: number
  paidCount: number
  totalCount: number
}
