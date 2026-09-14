import type { AddSavingsFormValues, SavingsInstrumentView, SavingsSummary } from './types'

export type SavingsSummaryCardsProps = {
  summary: SavingsSummary
}

export type SavingsInstrumentRowProps = {
  instrument: SavingsInstrumentView
}

export type AddSavingsFormProps = {
  onSubmit: (values: AddSavingsFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddSavingsDialogProps = {
  open: boolean
  onClose: () => void
}
