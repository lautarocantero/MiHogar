import type { z } from 'zod'
import type { SavingsGoal, SavingsInstrument } from '@/typings/domain/types'
import type { addSavingsFormSchema } from '@/validation/addSavingsFormSchema'
import type { addSavingsGoalFormSchema } from '@/validation/addSavingsGoalFormSchema'

export type SavingsInstrumentView = SavingsInstrument & {
  ownerLabel: string
  conditionText: string
  monthlyDeltaPercent: number | null
}

export type SavingsSummary = {
  totalSaved: number
  monthlyInterestTotal: number
  nextMaturityLabel: string | null
  totalInvested: number
}

export type SavingsGoalView = SavingsGoal & {
  ownerLabel: string
  percent: number
  remainingAmount: number
  remainingLabel: string
}

export type MonthlyEvolutionPoint = {
  monthKey: string
  label: string
  savings: number
  investments: number
  total: number
}

export type MonthSummaryItem = {
  key: string
  label: string
  icon: string
  amount: number
  deltaPercent: number | null
}

export type SavingsData = {
  summary: SavingsSummary
  savingsInstruments: SavingsInstrumentView[]
  investmentInstruments: SavingsInstrumentView[]
  goals: SavingsGoalView[]
  evolution: MonthlyEvolutionPoint[]
  monthSummary: MonthSummaryItem[]
}

export type AddSavingsFormValues = z.infer<typeof addSavingsFormSchema>

export type UseCreateSavingsResult = {
  submit: (values: AddSavingsFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type AddSavingsGoalFormValues = z.infer<typeof addSavingsGoalFormSchema>

export type UseCreateSavingsGoalResult = {
  submit: (values: AddSavingsGoalFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseUpdateSavingsGoalResult = {
  submit: (values: AddSavingsGoalFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseDeleteSavingsGoalResult = {
  submit: () => void
  isSubmitting: boolean
  errorMessage: string | null
}
