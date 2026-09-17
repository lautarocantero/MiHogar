import type { z } from 'zod'
import type { Debt } from '@/typings/domain/types'
import type { addDebtFormSchema } from '@/validation/addDebtFormSchema'

export type DebtView = Debt & {
  ownerLabel: string
  conditionText: string
  progressPercent: number | null
}

export type DebtsSummary = {
  totalOwedByHousehold: number
  totalOwedToHousehold: number
}

export type DebtsData = {
  summary: DebtsSummary
  owedByHousehold: DebtView[]
  owedToHousehold: DebtView[]
}

export type AddDebtFormValues = z.infer<typeof addDebtFormSchema>

export type UseCreateDebtResult = {
  submit: (values: AddDebtFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseUpdateDebtResult = {
  submit: (values: AddDebtFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseDeleteDebtResult = {
  submit: () => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseRegisterInstallmentPaymentResult = {
  submit: () => void
  isSubmitting: boolean
  errorMessage: string | null
}
