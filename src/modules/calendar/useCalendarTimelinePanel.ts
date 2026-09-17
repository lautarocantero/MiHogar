import { useMemo } from 'react'
import { addMonths, endOfMonth, format, startOfDay, startOfMonth } from 'date-fns'
import { useUnifiedEntries } from '@/modules/payments/hooks/useUnifiedEntries'
import type { UnifiedEntry } from '@/modules/payments/typings/types'
import type { TimelineRange } from '@/modules/timeline/typings/types'
import type { FlowSummary } from '@/typings/domain/types'
import { computeEntriesFlowSummary } from './computeEntriesFlowSummary'

export type CalendarTimelinePanelData = {
  summary: FlowSummary
  entries: UnifiedEntry[]
}

export function useCalendarTimelinePanel(
  monthOffset: number,
  range: TimelineRange
): CalendarTimelinePanelData {
  const allEntries = useUnifiedEntries()
  const referenceDate = addMonths(startOfDay(new Date()), monthOffset)
  const monthStart = format(startOfMonth(referenceDate), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(referenceDate), 'yyyy-MM-dd')
  const from = range.from ?? monthStart
  const to = range.to ?? monthEnd

  const entries = useMemo(
    () => allEntries.filter((entry) => entry.displayDate >= from && entry.displayDate <= to),
    [allEntries, from, to]
  )

  return useMemo(() => ({ summary: computeEntriesFlowSummary(entries), entries }), [entries])
}
