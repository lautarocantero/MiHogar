import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { TimelineSummaryCards } from '@/modules/timeline/components/TimelineSummaryCards'
import type { TimelineRange } from '@/modules/timeline/typings/types'
import { MonthGrid } from './components/MonthGrid'
import { WeekdayHeader } from './components/WeekdayHeader'
import { CalendarLegend } from './components/CalendarLegend'
import { MonthlyProgressCard } from './components/MonthlyProgressCard'
import { CalendarTimelineCard } from './components/CalendarTimelineCard'
import { useCalendarData } from './useCalendarData'
import { useCalendarMonthOffset } from './useCalendarMonthOffset'
import { useCalendarTimelinePanel } from './useCalendarTimelinePanel'

const DEFAULT_RANGE: TimelineRange = { from: null, to: null }
const LIST_MAX_HEIGHT = 480

export function CalendarPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { offset, goToPreviousMonth, goToNextMonth, canGoPrev, canGoNext } =
    useCalendarMonthOffset()
  const { weeks, monthLabel, progress, finalInstallmentPayments } = useCalendarData(offset)

  const [range, setRange] = useState<TimelineRange>(DEFAULT_RANGE)
  const { summary, entries } = useCalendarTimelinePanel(offset, range)
  const hasCustomRange = Boolean(range.from || range.to)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const entryRefs = useRef(new Map<string, HTMLLIElement>())

  const nextUpcomingEntryId = useMemo(() => {
    const upcoming = entries.find((entry) => !entry.isPast)
    return (upcoming ?? entries[entries.length - 1])?.id ?? null
  }, [entries])

  useEffect(() => {
    const targetId = selectedDate
      ? (entries.find((entry) => entry.displayDate === selectedDate)?.id ?? nextUpcomingEntryId)
      : nextUpcomingEntryId

    if (!targetId) return
    entryRefs.current.get(targetId)?.scrollIntoView({ block: 'start' })
  }, [selectedDate, entries, nextUpcomingEntryId])

  return (
    <Stack spacing={4} component="section" aria-label="Calendario de pagos">
      <TimelineSummaryCards summary={summary} />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <IconButton
                aria-label="Mes anterior"
                onClick={goToPreviousMonth}
                disabled={!canGoPrev}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" component="h2" sx={{ textTransform: 'capitalize' }}>
                {monthLabel}
              </Typography>
              <IconButton aria-label="Mes siguiente" onClick={goToNextMonth} disabled={!canGoNext}>
                <ChevronRightIcon />
              </IconButton>
            </Stack>
            <CalendarLegend />
            {weeks[0] && <WeekdayHeader days={weeks[0]} />}
            <MonthGrid
              weeks={weeks}
              selectedDate={selectedDate}
              highlightedDate={hoveredDate}
              onSelectDate={setSelectedDate}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <MonthlyProgressCard
              monthLabel={monthLabel}
              progress={progress}
              finalInstallmentPayments={finalInstallmentPayments}
            />
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                Línea de tiempo
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                mb={2}
              >
                <TextField
                  label="Desde"
                  type="date"
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={range.from ?? ''}
                  onChange={(event) =>
                    setRange((prev) => ({ ...prev, from: event.target.value || null }))
                  }
                />
                <TextField
                  label="Hasta"
                  type="date"
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={range.to ?? ''}
                  onChange={(event) =>
                    setRange((prev) => ({ ...prev, to: event.target.value || null }))
                  }
                />
                {hasCustomRange && (
                  <Button size="small" onClick={() => setRange(DEFAULT_RANGE)}>
                    Limpiar filtro
                  </Button>
                )}
              </Stack>

              {entries.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Todavía no hay movimientos para mostrar acá.
                </Typography>
              ) : (
                <Box sx={{ maxHeight: LIST_MAX_HEIGHT, overflowY: 'auto', pr: 1 }}>
                  <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {entries.map((entry) => (
                      <Box
                        key={entry.id}
                        component="li"
                        ref={(node: HTMLLIElement | null) => {
                          if (node) {
                            entryRefs.current.set(entry.id, node)
                          } else {
                            entryRefs.current.delete(entry.id)
                          }
                        }}
                        sx={{ listStyle: 'none' }}
                      >
                        <CalendarTimelineCard
                          entry={entry}
                          isHighlighted={entry.displayDate === hoveredDate}
                          onHover={setHoveredDate}
                          onSelect={() =>
                            navigate(ROUTES.PAYMENTS, { state: { focusEntryId: entry.id } })
                          }
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
            <Button component={RouterLink} to={ROUTES.PAYMENTS} variant="outlined" size="large">
              Ver pagos y servicios
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
