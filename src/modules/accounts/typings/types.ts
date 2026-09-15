import type { z } from 'zod'
import type { Account } from '@/typings/domain/types'
import type { addAccountFormSchema } from '@/validation/addAccountFormSchema'

export type AccountView = Account & {
  ownerLabel: string
  typeLabel: string
}

export type AccountsData = {
  totalAvailable: number
  creditCardDebt: number
  accountViews: AccountView[]
}

export type AddAccountFormValues = z.infer<typeof addAccountFormSchema>

export type UseCreateAccountResult = {
  submit: (values: AddAccountFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseUpdateAccountResult = {
  submit: (values: AddAccountFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseDeleteAccountResult = {
  submit: () => void
  isSubmitting: boolean
  errorMessage: string | null
}
