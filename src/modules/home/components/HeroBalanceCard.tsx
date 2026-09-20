import { Box, Card, Chip, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { resolveAccountTypeColor } from '@/utils/domain/resolveAccountTypeColor'
import type { HeroBalanceCardProps } from '../typings/props'

export function HeroBalanceCard({
  totalAvailable,
  accounts,
  pendingTotal,
  pendingCount,
  remainingAfterPayments
}: HeroBalanceCardProps): React.JSX.Element {
  const isRemainingPositive = remainingAfterPayments >= 0

  return (
    <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Card
          sx={{
            background: `linear-gradient(135deg, ${organicColors.orange.main} 0%, ${organicColors.orange.main} 55%, ${organicColors.orange.dark} 100%)`,
            color: '#fffdf9',
            p: 4,
            height: '100%'
          }}
          elevation={0}
        >
          <Typography variant="body1" sx={{ opacity: 0.92 }}>
            Tenés disponible hoy
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontWeight: 400,
              lineHeight: 1.05,
              fontSize: { xs: '2.75rem', md: '3.5rem' }
            }}
          >
            {formatCurrency(totalAvailable)}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, maxWidth: 640 }}>
            Esto es la plata que podés usar ahora, sumando todas tus cuentas y el efectivo.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {accounts.map((account) => {
              const typeColor = resolveAccountTypeColor(account.type)
              const hasMoney = account.balance > 0
              return (
                <Chip
                  key={account.id}
                  label={`${account.name} · ${formatCurrency(account.balance)}`}
                  sx={{
                    backgroundColor: typeColor.dark,
                    color: '#ffffff',
                    opacity: hasMoney ? 1 : 0.5
                  }}
                />
              )
            })}
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={3} height="100%">
          <Card
            component={RouterLink}
            to={ROUTES.PAYMENTS}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.25,
              backgroundColor: organicColors.orange.tint,
              p: 3,
              flex: 1,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { filter: 'brightness(0.98)' }
            }}
            elevation={0}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                flexShrink: 0,
                backgroundColor: '#fadfc9',
                color: organicColors.orange.dark
              }}
            >
              <EventBusyIcon />
            </Box>
            <Box flexGrow={1} minWidth={0}>
              <Typography variant="body1" color="text.secondary">
                Te falta pagar este mes
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: organicTypography.titleFontFamily,
                  fontSize: '1.875rem',
                  color: organicColors.orange.dark
                }}
              >
                {formatCurrency(pendingTotal)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pendingCount} {pendingCount === 1 ? 'pago pendiente' : 'pagos pendientes'}
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ color: organicColors.neutral.textSecondary }} />
          </Card>
          <Card
            component={RouterLink}
            to={ROUTES.PROJECTION}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2.25,
              backgroundColor: organicColors.sage.tint,
              p: 3,
              flex: 1,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { filter: 'brightness(0.98)' }
            }}
            elevation={0}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                flexShrink: 0,
                backgroundColor: '#dff0c8',
                color: organicColors.sage.dark
              }}
            >
              <AccountBalanceWalletIcon />
            </Box>
            <Box flexGrow={1} minWidth={0}>
              <Typography variant="body1" color="text.secondary">
                Si pagás todo, te queda
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: organicTypography.titleFontFamily,
                  fontSize: '1.875rem',
                  color: organicColors.sage.dark
                }}
              >
                {formatCurrency(remainingAfterPayments)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isRemainingPositive ? 'A favor, sin deudas' : 'Vas a necesitar más plata'}
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ color: organicColors.neutral.textSecondary }} />
          </Card>
        </Stack>
      </Grid>
    </Grid>
  )
}
