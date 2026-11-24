import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { CalendarBadgeKind, CalendarEventKind } from '../typings/enums'
import type { MonthGridCellProps } from '../typings/props'

const EVENT_STYLES: Record<
  CalendarEventKind,
  { background: string; border: string; text: string }
> = {
  [CalendarEventKind.PENDING]: {
    background: organicColors.overdue.tint,
    border: organicColors.overdue.border,
    text: organicColors.overdue.main
  },
  [CalendarEventKind.PAID]: {
    background: organicColors.paid.tint,
    border: organicColors.paid.border,
    text: organicColors.paid.main
  },
  [CalendarEventKind.INCOME]: {
    background: organicColors.income.tint,
    border: organicColors.income.border,
    text: organicColors.income.main
  }
}

const BADGE_STYLES: Record<CalendarBadgeKind, { background: string; text: string }> = {
  [CalendarBadgeKind.CARD_CLOSING]: {
    background: organicColors.orange.tint,
    text: organicColors.orange.dark
  },
  [CalendarBadgeKind.CARD_DUE]: {
    background: organicColors.violet.tint,
    text: organicColors.violet.dark
  },
  [CalendarBadgeKind.INCOME]: {
    background: organicColors.income.tint,
    text: organicColors.income.main
  }
}

const MAX_VISIBLE_EVENTS = 2
const MAX_VISIBLE_BADGES = 2

export function MonthGridCell({
  day,
  isSelected,
  isHighlighted,
  onSelect
}: MonthGridCellProps): React.JSX.Element {
  const hasFinalInstallment = day.events.some((event) => event.isFinalInstallment)
  const primaryEvent = day.events[0] ?? null
  const eventStyle = primaryEvent ? EVENT_STYLES[primaryEvent.kind] : null
  const visibleEvents = day.events.slice(0, MAX_VISIBLE_EVENTS)
  const hiddenCount = day.events.length - visibleEvents.length
  const visibleBadges = day.badges.slice(0, MAX_VISIBLE_BADGES)

  const cell = (
    <Box
      component={day.events.length > 0 ? 'article' : 'div'}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      aria-pressed={isSelected}
      aria-label={
        day.events.length > 0
          ? `Día ${day.dayOfMonth}, ${day.events.length} evento(s), total ${formatCurrency(day.events.reduce((sum, e) => sum + e.amount, 0))}`
          : `Día ${day.dayOfMonth}`
      }
      sx={{
        minHeight: { xs: 52, sm: 96 },
        maxHeight: { xs: 52, sm: 96 },
        overflow: 'hidden',
        borderRadius: 0,
        p: { xs: 0.5, sm: 1 },
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        cursor: 'pointer',
        backgroundColor: day.isToday
          ? organicColors.blue.tint
          : (eventStyle?.background ??
            (day.isCardPaymentPeriod
              ? organicColors.violet.tint
              : day.isPast && day.isCurrentMonth
                ? organicColors.brown.tint
                : organicColors.surface)),
        border: hasFinalInstallment
          ? `3px solid ${organicColors.sage.main}`
          : day.isToday
            ? `3px solid ${organicColors.blue.main}`
            : `1px solid ${eventStyle?.border ?? (day.isCardPaymentPeriod ? organicColors.violet.border : organicColors.neutral.border)}`,
        boxShadow: isHighlighted
          ? `0 0 0 3px ${organicColors.brown.main}`
          : isSelected
            ? `0 0 0 2px ${organicColors.blue.main}`
            : day.isToday
              ? `0 0 0 2px ${organicColors.blue.tint}`
              : 'none',
        opacity: !day.isCurrentMonth ? 0.4 : day.isPast ? 0.55 : 1,
        transition: 'box-shadow 0.15s ease'
      }}
    >
      <Typography
        variant="body2"
        fontWeight={day.isToday ? 700 : 400}
        color={day.isToday ? organicColors.blue.dark : undefined}
      >
        {day.dayOfMonth}
      </Typography>
      {/* En teléfonos la celda mide ~45px: en vez de textos se muestran puntos de color
          (el detalle aparece al tocar el día, en los totales y la línea de tiempo). */}
      {(visibleBadges.length > 0 || visibleEvents.length > 0) && (
        <Box
          aria-hidden="true"
          sx={{ display: { xs: 'flex', sm: 'none' }, gap: 0.25, flexWrap: 'wrap' }}
        >
          {visibleBadges.map((badge, index) => (
            <Box
              key={`badge-${index}`}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: BADGE_STYLES[badge.kind].text
              }}
            />
          ))}
          {visibleEvents.map((event, index) => (
            <Box
              key={`event-${index}`}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: EVENT_STYLES[event.kind].text
              }}
            />
          ))}
        </Box>
      )}
      {visibleBadges.map((badge, index) => (
        <Box
          key={index}
          sx={{
            display: { xs: 'none', sm: 'inline-block' },
            alignSelf: 'flex-start',
            maxWidth: '100%',
            px: 0.75,
            py: 0.125,
            borderRadius: 0,
            backgroundColor: BADGE_STYLES[badge.kind].background,
            color: BADGE_STYLES[badge.kind].text
          }}
        >
          <Typography
            variant="caption"
            noWrap
            sx={{ display: 'block', fontSize: '0.625rem', fontWeight: 600 }}
          >
            {badge.kind === CalendarBadgeKind.INCOME
              ? badge.label
              : badge.kind === CalendarBadgeKind.CARD_CLOSING
                ? `Cierre de tarjeta${badge.amount ? ` · ${formatCurrency(badge.amount)}` : ''}`
                : 'Vencimiento de tarjeta'}
          </Typography>
        </Box>
      ))}
      {visibleEvents.map((event, index) => (
        <Typography
          key={index}
          variant="caption"
          sx={{
            display: { xs: 'none', sm: 'block' },
            color: EVENT_STYLES[event.kind].text,
            lineHeight: 1.2
          }}
          noWrap
        >
          {formatCurrency(event.amount)}
        </Typography>
      ))}
      {hiddenCount > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          +{hiddenCount} más
        </Typography>
      )}
    </Box>
  )

  if (day.events.length === 0) {
    return cell
  }

  return (
    <Tooltip
      title={
        <Stack spacing={0.5}>
          {day.events.map((event, index) => (
            <Typography key={index} variant="caption" component="div">
              {event.label} — {formatCurrency(event.amount)}
              {event.isFinalInstallment ? ' (última cuota)' : ''}
            </Typography>
          ))}
        </Stack>
      }
    >
      {cell}
    </Tooltip>
  )
}
