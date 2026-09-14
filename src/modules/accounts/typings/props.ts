import type { AccountView, AddAccountFormValues } from './types'

export type AccountCardProps = {
  account: AccountView
}

export type CreditCardInfoLineProps = {
  closingDay?: number
  dueDay?: number
  installmentsRemaining?: number
}

export type AddAccountFormProps = {
  onSubmit: (values: AddAccountFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddAccountDialogProps = {
  open: boolean
  onClose: () => void
}
