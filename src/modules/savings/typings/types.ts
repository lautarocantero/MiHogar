import type { z } from 'zod'
import type { SavingsInstrument } from '@/typings/domain/types'
import type { addSavingsFormSchema } from '@/validation/addSavingsFormSchema'

export type SavingsInstrumentView = SavingsInstrument & {
  ownerLabel: string
  conditionText: string
}

export type SavingsSummary = {
  totalSaved: number
  monthlyInterestTotal: number
  nextMaturityLabel: string | null
}

export type SavingsData = {
  summary: SavingsSummary
  instruments: SavingsInstrumentView[]
}

export type AddSavingsFormValues = z.infer<typeof addSavingsFormSchema>

export type UseCreateSavingsResult = {
  submit: (values: AddSavingsFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}
