import type { FlowSummary, Movement } from '@/typings/domain/types'
import type { QuickAddFormValues } from '@/modules/quickAdd/typings/types'

export type TimelineEntry = {
  movement: Movement
  concept: string
  detail: string
  isEstimated: boolean
  isPast: boolean
}

export type TimelineData = {
  summary: FlowSummary
  entries: TimelineEntry[]
}

export type UseUpdateMovementResult = {
  submit: (values: QuickAddFormValues) => void
  isSubmitting: boolean
  errorMessage: string | null
}

export type UseDeleteMovementResult = {
  submit: () => void
  isSubmitting: boolean
  errorMessage: string | null
}
