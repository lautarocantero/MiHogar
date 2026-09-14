import type { FlowSummary, Movement } from '@/typings/domain/types'

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
