import { Box, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { CalendarEventKind } from '../typings/enums'
import type { MonthGridCellProps } from '../typings/props'

const EVENT_STYLES: Record<
  CalendarEventKind,
  { background: string; border: string; text: string }
> = {
  [CalendarEventKind.PENDING]: {
    background: organicColors.orange.tint,
    border: organicColors.orange.main,
    text: organicColors.orange.dark
  },
  [CalendarEventKind.PAID]: {
    background: organicColors.neutral.border,
    border: 'transparent',
    text: organicColors.neutral.textSecondary
  },
  [CalendarEventKind.INCOME]: {
    background: organicColors.sage.tint,
    border: 'transparent',
    text: organicColors.sage.dark
  }
}

export function MonthGridCell({ day }: MonthGridCellProps): React.JSX.Element {
  const eventStyle = day.event ? EVENT_STYLES[day.event.kind] : null

  return (
    <Box
      component={day.event ? 'article' : 'div'}
      aria-label={
        day.event ? `Día ${day.dayOfMonth}, ${formatCurrency(day.event.amount)}` : undefined
      }
      sx={{
        aspectRatio: '1 / 1',
        borderRadius: '16px',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        backgroundColor: day.isToday
          ? organicColors.orange.tint
          : (eventStyle?.background ?? organicColors.surface),
        border: day.isToday
          ? `2px solid ${organicColors.orange.main}`
          : `1px solid ${eventStyle?.border ?? organicColors.neutral.border}`,
        opacity: !day.isCurrentMonth ? 0.4 : day.isPast ? 0.55 : 1
      }}
    >
      <Typography variant="body2" fontWeight={day.isToday ? 700 : 400}>
        {day.dayOfMonth}
      </Typography>
      {day.event && (
        <Typography variant="caption" sx={{ color: eventStyle?.text }}>
          {formatCurrency(day.event.amount)}
        </Typography>
      )}
    </Box>
  )
}
