import { Box, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { organicColors } from '@/theme/tokens'
import type { WeekdayHeaderProps } from '../typings/props'

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function WeekdayHeader({ days }: WeekdayHeaderProps): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', gap: 1, px: 0.5 }}>
      {days.map((day) => (
        <Typography
          key={day.isoDate}
          variant="caption"
          sx={{
            width: '14.28%',
            textAlign: 'center',
            color: organicColors.neutral.textSecondary,
            fontWeight: 600
          }}
        >
          {capitalize(format(parseISO(day.isoDate), 'EEEE', { locale: es }))}
        </Typography>
      ))}
    </Box>
  )
}
