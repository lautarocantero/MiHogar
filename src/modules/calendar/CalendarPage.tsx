import { Box, Button, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { MonthGrid } from './components/MonthGrid'
import { WeekdayHeader } from './components/WeekdayHeader'
import { CalendarLegend } from './components/CalendarLegend'
import { MonthlyProgressCard } from './components/MonthlyProgressCard'
import { WeekAheadList } from './components/WeekAheadList'
import { useCalendarData } from './useCalendarData'

export function CalendarPage(): React.JSX.Element {
  const { weeks, monthLabel, progress, weekAheadPayments } = useCalendarData()

  return (
    <Grid container spacing={4} component="section" aria-label="Calendario de pagos">
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          <CalendarLegend />
          {weeks[0] && <WeekdayHeader days={weeks[0]} />}
          <MonthGrid weeks={weeks} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <MonthlyProgressCard monthLabel={monthLabel} progress={progress} />
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              Esta semana
            </Typography>
            <WeekAheadList payments={weekAheadPayments} />
          </Box>
          <Button component={RouterLink} to={ROUTES.PAYMENTS} variant="outlined" size="large">
            Ver todos los pagos
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}
