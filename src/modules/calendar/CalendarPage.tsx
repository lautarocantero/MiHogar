import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { MonthGrid } from './components/MonthGrid'
import { WeekdayHeader } from './components/WeekdayHeader'
import { CalendarLegend } from './components/CalendarLegend'
import { MonthlyProgressCard } from './components/MonthlyProgressCard'
import { MonthPaymentsList } from './components/MonthPaymentsList'
import { useCalendarData } from './useCalendarData'
import { useCalendarMonthOffset } from './useCalendarMonthOffset'

export function CalendarPage(): React.JSX.Element {
  const { offset, goToPreviousMonth, goToNextMonth, canGoPrev, canGoNext } =
    useCalendarMonthOffset()
  const { weeks, monthLabel, progress, monthPayments, finalInstallmentPayments } =
    useCalendarData(offset)

  return (
    <Grid container spacing={4} component="section" aria-label="Calendario de pagos">
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <IconButton aria-label="Mes anterior" onClick={goToPreviousMonth} disabled={!canGoPrev}>
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
          <MonthGrid weeks={weeks} />
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
              Este mes
            </Typography>
            <MonthPaymentsList payments={monthPayments} />
          </Box>
          <Button component={RouterLink} to={ROUTES.PAYMENTS} variant="outlined" size="large">
            Ver todos los pagos
          </Button>
        </Stack>
      </Grid>
    </Grid>
  )
}
