import { Box, Link as MuiLink, Stack, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { organicColors, organicTypography } from '@/theme/tokens'
import { HeroBalanceCard } from './components/HeroBalanceCard'
import { UpcomingPaymentsList } from './components/UpcomingPaymentsList'
import { RecentMovementsList } from './components/RecentMovementsList'
import { useHomeData } from './useHomeData'

export function HomePage(): React.JSX.Element {
  const {
    totalAvailable,
    accounts,
    pendingTotal,
    pendingCount,
    remainingAfterPayments,
    upcomingPayments,
    recentMovements
  } = useHomeData()

  return (
    <Stack spacing={5} component="section" aria-label="Resumen de hoy">
      <HeroBalanceCard
        totalAvailable={totalAvailable}
        accounts={accounts}
        pendingTotal={pendingTotal}
        pendingCount={pendingCount}
        remainingAfterPayments={remainingAfterPayments}
      />

      <Box component="section" aria-labelledby="upcoming-payments-title">
        <Typography
          id="upcoming-payments-title"
          component="h2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2.25,
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.75rem',
            fontWeight: 400,
            color: organicColors.orange.dark
          }}
        >
          <WarningIcon fontSize="large" aria-hidden="true" />
          Lo más urgente
        </Typography>
        <UpcomingPaymentsList payments={upcomingPayments} />
        <MuiLink
          component={RouterLink}
          to={ROUTES.CALENDAR}
          sx={{ display: 'inline-block', mt: 2 }}
        >
          Ver el calendario completo →
        </MuiLink>
      </Box>

      <Box component="section" aria-labelledby="recent-movements-title">
        <Typography
          id="recent-movements-title"
          component="h2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2.25,
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.75rem',
            fontWeight: 400,
            color: organicColors.orange.dark
          }}
        >
          <ScheduleIcon fontSize="large" aria-hidden="true" />
          Lo último que pasó
        </Typography>
        <RecentMovementsList movements={recentMovements} />
        <MuiLink
          component={RouterLink}
          to={ROUTES.CALENDAR}
          sx={{ display: 'inline-block', mt: 2 }}
        >
          Ver toda la línea de tiempo →
        </MuiLink>
      </Box>
    </Stack>
  )
}
