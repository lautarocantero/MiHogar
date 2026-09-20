import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TuneIcon from '@mui/icons-material/Tune'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import BalanceIcon from '@mui/icons-material/Balance'
import EventNoteIcon from '@mui/icons-material/EventNote'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { organicColors, organicTypography, sidebarColors } from '@/theme/tokens'
import twigPattern from '@/assets/images/twig-pattern.png'
import type { TimelineRange } from '@/modules/timeline/typings/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { updateAccount } from '@/store/accounts/accountsSlice'
import { MonthGrid } from './components/MonthGrid'
import { WeekdayHeader } from './components/WeekdayHeader'
import { CalendarLegend } from './components/CalendarLegend'
import { CalendarTimelineCard } from './components/CalendarTimelineCard'
import { useCalendarData } from './useCalendarData'
import { useCalendarMonthOffset } from './useCalendarMonthOffset'
import { useCalendarTimelinePanel } from './useCalendarTimelinePanel'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { CalendarBadgeKind } from './typings/enums'

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

type MinPaymentTileProps = {
  accountId: string
  currentValue: number | undefined
  dueDate: string
}

function MinPaymentTile({
  accountId,
  currentValue,
  dueDate
}: MinPaymentTileProps): React.JSX.Element {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(selectAllAccounts)
  const [draft, setDraft] = useState(currentValue != null ? String(currentValue) : '')

  useEffect(() => {
    setDraft(currentValue != null ? String(currentValue) : '')
  }, [currentValue, accountId])

  const commit = (): void => {
    const account = accounts.find((candidate) => candidate.id === accountId)
    if (!account) return
    const parsed = draft === '' ? undefined : Number(draft)
    if (parsed !== undefined && (Number.isNaN(parsed) || parsed < 0)) return
    dispatch(
      updateAccount({
        ...account,
        minPayment: parsed,
        minPaymentDueDate: parsed !== undefined ? dueDate : undefined
      })
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        backgroundColor: organicColors.surface,
        border: `1px solid ${organicColors.neutral.border}`,
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
          backgroundColor: organicColors.violet.tint,
          color: organicColors.violet.dark
        }}
      >
        <PriceCheckIcon />
      </Box>
      <Box flexGrow={1} minWidth={0}>
        <Typography variant="body2" color="text.secondary">
          Pago mínimo
        </Typography>
        <TextField
          variant="standard"
          type="number"
          placeholder="(aún no ingresado)"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              ;(event.target as HTMLInputElement).blur()
            }
          }}
          slotProps={{ input: { sx: { fontFamily: organicTypography.titleFontFamily } } }}
          sx={{ mt: 0.25, width: '100%' }}
        />
      </Box>
    </Box>
  )
}

export function CalendarPage(): React.JSX.Element {
  const navigate = useNavigate()
  const accounts = useAppSelector(selectAllAccounts)
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

  const displayedEntries = useMemo(
    () => (selectedDate ? entries.filter((entry) => entry.displayDate === selectedDate) : entries),
    [entries, selectedDate]
  )

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

  useEffect(() => {
    setSelectedDate(null)
    didInitialScroll.current = false
  }, [offset])

  const isDifferencePositive = summary.difference >= 0

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null
    for (const week of weeks) {
      const found = week.find((day) => day.isoDate === selectedDate)
      if (found) return found
    }
    return null
  }, [weeks, selectedDate])

  const selectedDayTotal = useMemo(
    () => selectedDay?.events.reduce((sum, event) => sum + event.amount, 0) ?? 0,
    [selectedDay]
  )

  const selectedDayClosingBadge = useMemo(
    () =>
      selectedDay?.badges.find((badge) => badge.kind === CalendarBadgeKind.CARD_CLOSING) ?? null,
    [selectedDay]
  )

  const closingAccount = useMemo(
    () =>
      selectedDayClosingBadge?.accountId
        ? (accounts.find((account) => account.id === selectedDayClosingBadge.accountId) ?? null)
        : null,
    [accounts, selectedDayClosingBadge]
  )

  const effectiveMinPayment =
    closingAccount && closingAccount.minPaymentDueDate === selectedDayClosingBadge?.dueDate
      ? closingAccount.minPayment
      : undefined

  return (
    <Grid container spacing={4} component="section" aria-label="Calendario de pagos">
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          {selectedDate ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: selectedDayClosingBadge ? '1fr 1fr' : '1fr',
                gridTemplateRows: 'auto auto',
                gap: 2
              }}
            >
              {selectedDayClosingBadge ? (
                <>
                  <StatTile
                    icon={<CreditCardIcon />}
                    label={selectedDayClosingBadge.accountName ?? 'Cierre de tarjeta'}
                    value={formatCurrency(selectedDayClosingBadge.amount ?? 0)}
                    valueColor={organicColors.orange.dark}
                    background={organicColors.orange.tint}
                    border="#f2d9c8"
                    iconBg="#f8dcca"
                    iconColor={organicColors.orange.dark}
                  />
                  <StatTile
                    icon={<EventNoteIcon />}
                    label="Cierra el"
                    value={format(parseISO(selectedDate), "d 'de' MMMM", { locale: es })}
                    valueColor={organicColors.orange.dark}
                    background={organicColors.surface}
                    border={organicColors.neutral.border}
                    iconBg={organicColors.orange.tint}
                    iconColor={organicColors.orange.dark}
                  />
                  <StatTile
                    icon={<EventAvailableIcon />}
                    label="Vence el"
                    value={
                      selectedDayClosingBadge.dueDate
                        ? format(parseISO(selectedDayClosingBadge.dueDate), "d 'de' MMMM", {
                            locale: es
                          })
                        : '—'
                    }
                    valueColor={organicColors.violet.dark}
                    background={organicColors.violet.tint}
                    border={organicColors.violet.border}
                    iconBg={organicColors.violet.tint}
                    iconColor={organicColors.violet.dark}
                  />
                  {closingAccount && (
                    <MinPaymentTile
                      accountId={closingAccount.id}
                      currentValue={effectiveMinPayment}
                      dueDate={selectedDayClosingBadge.dueDate ?? selectedDate}
                    />
                  )}
                </>
              ) : (
                <StatTile
                  icon={<EventNoteIcon />}
                  label={`Total del ${format(parseISO(selectedDate), "d 'de' MMMM", { locale: es })}`}
                  value={formatCurrency(selectedDayTotal)}
                  valueColor={organicColors.orange.dark}
                  background={organicColors.surface}
                  border={organicColors.neutral.border}
                  iconBg={organicColors.orange.tint}
                  iconColor={organicColors.orange.dark}
                />
              )}
            </Box>
          ) : (
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
          )}

          <Stack
            spacing={2}
            sx={{
              border: `1px solid ${organicColors.neutral.border}`,
              backgroundColor: organicColors.surface,
              p: 2.5
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

      <Grid size={{ xs: 12, md: 4 }} sx={{ alignSelf: 'flex-start', position: 'sticky', top: 0 }}>
        <Box
          sx={{
            position: 'relative',
            height: 'calc(100vh - 128px)',
            maxHeight: 'calc(100vh - 128px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            background: sidebarColors.gradient,
            p: 2
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${twigPattern})`,
              backgroundSize: 560,
              backgroundRepeat: 'repeat',
              filter: 'invert(1) grayscale(1) contrast(0.9)',
              mixBlendMode: 'screen',
              opacity: sidebarColors.patternOpacity,
              pointerEvents: 'none'
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: organicTypography.titleFontFamily,
                  fontSize: '1.375rem',
                  fontWeight: 400,
                  color: sidebarColors.onDark
                }}
              >
                Línea de tiempo
              </Typography>
              {selectedDate && (
                <Button
                  size="small"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => setSelectedDate(null)}
                  sx={{
                    color: organicColors.weakYellow,
                    '&:hover': { backgroundColor: 'rgba(255,253,249,0.10)' }
                  }}
                >
                  Eliminar filtros
                </Button>
              )}
            </Stack>
            <Button
              size="small"
              startIcon={<TuneIcon />}
              onClick={() => setFiltersOpen((prev) => !prev)}
              sx={{
                color: hasCustomRange ? organicColors.weakYellow : 'rgba(255,253,249,0.85)',
                '&:hover': { backgroundColor: 'rgba(255,253,249,0.10)' }
              }}
            >
              Filtros{hasCustomRange ? ' · 1' : ''}
            </Button>
          </Stack>
          {filtersOpen && (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ position: 'relative', zIndex: 1 }}
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
                sx={{ backgroundColor: organicColors.surface }}
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
                sx={{ backgroundColor: organicColors.surface }}
              />
              {hasCustomRange && (
                <Button
                  size="small"
                  onClick={() => setRange(DEFAULT_RANGE)}
                  sx={{ color: 'rgba(255,253,249,0.85)' }}
                >
                  Limpiar filtro
                </Button>
              )}
            </Stack>
          )}

          {displayedEntries.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ position: 'relative', zIndex: 1, color: 'rgba(255,253,249,0.75)' }}
            >
              Todavía no hay movimientos para mostrar acá.
            </Typography>
          ) : (
            <Box
              sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', position: 'relative', zIndex: 1 }}
            >
              <Stack
                spacing={2}
                component="ul"
                sx={{ listStyle: 'none', p: 0, m: 0, position: 'relative', zIndex: 1 }}
              >
                {displayedEntries.map((entry) => (
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
          <Button
            component={RouterLink}
            to={ROUTES.PAYMENTS}
            variant="outlined"
            size="large"
            sx={{
              position: 'relative',
              zIndex: 1,
              borderRadius: 0,
              borderColor: 'rgba(255,253,249,0.45)',
              color: 'rgba(255,253,249,0.95)',
              '&:hover': {
                backgroundColor: 'rgba(255,253,249,0.12)',
                borderColor: 'rgba(255,253,249,0.45)'
              }
            }}
          >
            Ver pagos y servicios
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}
