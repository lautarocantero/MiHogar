import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TuneIcon from '@mui/icons-material/Tune'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import BalanceIcon from '@mui/icons-material/Balance'
import EventNoteIcon from '@mui/icons-material/EventNote'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { organicColors, organicTypography } from '@/theme/tokens'
import type { TimelineRange } from '@/modules/timeline/typings/types'
import { MonthGrid } from './components/MonthGrid'
import { WeekdayHeader } from './components/WeekdayHeader'
import { CalendarLegend } from './components/CalendarLegend'
import { CalendarTimelineCard } from './components/CalendarTimelineCard'
import { useCalendarData } from './useCalendarData'
import { useCalendarMonthOffset } from './useCalendarMonthOffset'
import { useCalendarTimelinePanel } from './useCalendarTimelinePanel'
import { formatCurrency } from '@/utils/formatting/formatCurrency'

const DEFAULT_RANGE: TimelineRange = { from: null, to: null }

type StatTileProps = {
  icon: React.ReactNode
  label: string
  value: string
  valueColor: string
  sub?: React.ReactNode
  background: string
  border: string
  iconBg: string
  iconColor: string
}

function StatTile({
  icon,
  label,
  value,
  valueColor,
  sub,
  background,
  border,
  iconBg,
  iconColor
}: StatTileProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        backgroundColor: background,
        border: `1px solid ${border}`,
        p: 2.25,
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 46,
          height: 46,
          flexShrink: 0,
          backgroundColor: iconBg,
          color: iconColor
        }}
      >
        {icon}
      </Box>
      <Box flexGrow={1} minWidth={0}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          component="p"
          noWrap
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.375rem',
            color: valueColor
          }}
        >
          {value}
        </Typography>
        {sub}
      </Box>
    </Box>
  )
}

export function CalendarPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { offset, goToPreviousMonth, goToNextMonth, canGoPrev, canGoNext } =
    useCalendarMonthOffset()
  const { weeks, monthLabel, progress, finalInstallmentPayments } = useCalendarData(offset)

  const [range, setRange] = useState<TimelineRange>(DEFAULT_RANGE)
  const { summary, entries } = useCalendarTimelinePanel(offset, range)
  const hasCustomRange = Boolean(range.from || range.to)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const entryRefs = useRef(new Map<string, HTMLLIElement>())
  const didInitialScroll = useRef(false)

  const nextUpcomingEntryId = useMemo(() => {
    const upcoming = entries.find((entry) => !entry.isPast)
    return (upcoming ?? entries[entries.length - 1])?.id ?? null
  }, [entries])

  useEffect(() => {
    if (selectedDate) {
      const targetId = entries.find((entry) => entry.displayDate === selectedDate)?.id
      if (targetId) entryRefs.current.get(targetId)?.scrollIntoView({ block: 'nearest' })
      return
    }

    if (didInitialScroll.current || !nextUpcomingEntryId) return
    entryRefs.current.get(nextUpcomingEntryId)?.scrollIntoView({ block: 'start' })
    didInitialScroll.current = true
  }, [selectedDate, entries, nextUpcomingEntryId])

  const isDifferencePositive = summary.difference >= 0

  return (
    <Grid
      container
      spacing={4}
      component="section"
      aria-label="Calendario de pagos"
      sx={{ height: '100%', overflow: 'hidden' }}
    >
      <Grid size={{ xs: 12, md: 8 }} sx={{ minHeight: 0, overflow: 'hidden' }}>
        <Stack spacing={3} height="100%" minHeight={0} sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto',
              gap: 2
            }}
          >
            <StatTile
              icon={<AddCircleOutlineIcon />}
              label="Entró"
              value={`+ ${formatCurrency(summary.totalIn)}`}
              valueColor={organicColors.income.main}
              background={organicColors.income.tint}
              border={organicColors.income.border}
              iconBg={organicColors.income.iconBg}
              iconColor={organicColors.income.main}
            />
            <StatTile
              icon={<BalanceIcon />}
              label="Diferencia"
              value={`${isDifferencePositive ? '+' : '−'} ${formatCurrency(Math.abs(summary.difference))}`}
              valueColor={
                isDifferencePositive ? organicColors.income.main : organicColors.overdue.main
              }
              background={organicColors.surface}
              border={organicColors.neutral.border}
              iconBg={organicColors.orange.tint}
              iconColor={organicColors.orange.dark}
            />
            <StatTile
              icon={<RemoveCircleOutlineIcon />}
              label="Salió"
              value={`− ${formatCurrency(summary.totalOut)}`}
              valueColor={organicColors.orange.dark}
              background={organicColors.orange.tint}
              border="#f2d9c8"
              iconBg="#f8dcca"
              iconColor={organicColors.orange.dark}
            />
            <StatTile
              icon={<EventNoteIcon />}
              label={`Total a pagar en ${monthLabel}`}
              value={formatCurrency(progress.totalDue)}
              valueColor={organicColors.orange.dark}
              background={organicColors.surface}
              border={organicColors.neutral.border}
              iconBg={organicColors.orange.tint}
              iconColor={organicColors.orange.dark}
              sub={
                <>
                  <Box sx={{ height: 9, backgroundColor: organicColors.neutral.border, mt: 1 }}>
                    <Box
                      sx={{
                        height: 9,
                        width: `${Math.min(progress.progressPercent, 100)}%`,
                        backgroundColor: organicColors.sage.main
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Ya pagaste {formatCurrency(progress.paidSoFar)} de los{' '}
                    {formatCurrency(progress.totalDue)}
                  </Typography>
                </>
              }
            />
          </Box>

          <Stack
            spacing={2}
            sx={{
              border: `1px solid ${organicColors.neutral.border}`,
              backgroundColor: organicColors.surface,
              p: 2.5,
              flexGrow: 1,
              minHeight: 0,
              overflowY: 'auto'
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <IconButton
                aria-label="Mes anterior"
                onClick={goToPreviousMonth}
                disabled={!canGoPrev}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography
                component="h2"
                sx={{
                  textTransform: 'capitalize',
                  fontFamily: organicTypography.titleFontFamily,
                  fontSize: '1.375rem',
                  fontWeight: 400,
                  color: organicColors.orange.dark
                }}
              >
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
            {finalInstallmentPayments.map((entry) => (
              <Typography
                key={entry.concept}
                variant="body2"
                sx={{ color: organicColors.sage.dark, fontWeight: 600 }}
              >
                Faltan {entry.daysUntil} día{entry.daysUntil === 1 ? '' : 's'}: este mes terminás de
                pagar {entry.concept} con tarjeta de crédito.
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} sx={{ minHeight: 0, overflow: 'hidden' }}>
        <Stack spacing={2} height="100%" minHeight={0} sx={{ overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              component="h2"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.375rem',
                fontWeight: 400,
                color: organicColors.orange.dark
              }}
            >
              Línea de tiempo
            </Typography>
            <Button
              size="small"
              startIcon={<TuneIcon />}
              onClick={() => setFiltersOpen((prev) => !prev)}
              sx={{ color: hasCustomRange ? 'primary.main' : 'text.secondary' }}
            >
              Filtros{hasCustomRange ? ' · 1' : ''}
            </Button>
          </Stack>
          {filtersOpen && (
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
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
          )}

          {entries.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Todavía no hay movimientos para mostrar acá.
            </Typography>
          ) : (
            <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', pr: 1 }}>
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
          <Button component={RouterLink} to={ROUTES.PAYMENTS} variant="outlined" size="large">
            Ver pagos y servicios
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}
