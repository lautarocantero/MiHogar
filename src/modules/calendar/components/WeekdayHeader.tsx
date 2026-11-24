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
    <Box sx={{ display: 'flex', gap: { xs: 0, sm: 1 }, px: { xs: 0, sm: 0.5 } }}>
      {days.map((day) => {
        const date = parseISO(day.isoDate)
        const fullName = capitalize(format(date, 'EEEE', { locale: es }))
        return (
          <Typography
            key={day.isoDate}
            variant="caption"
            title={fullName}
            sx={{
              width: '14.28%',
              minWidth: 0,
              textAlign: 'center',
              color: organicColors.neutral.textSecondary,
              fontWeight: 600
            }}
          >
            {/* En teléfonos el nombre completo no entra en la columna: se abrevia ("Dom"). */}
            <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>
              {fullName}
            </Box>
            <Box
              component="abbr"
              title={fullName}
              sx={{ display: { xs: 'inline', lg: 'none' }, textDecoration: 'none' }}
            >
              {capitalize(format(date, 'EEE', { locale: es })).replace('.', '')}
            </Box>
          </Typography>
        )
      })}
    </Box>
  )
}
