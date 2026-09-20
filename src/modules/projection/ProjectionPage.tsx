import { useState } from 'react'
import { Box, Card, MenuItem, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SouthIcon from '@mui/icons-material/South'
import NorthIcon from '@mui/icons-material/North'
import SavingsIcon from '@mui/icons-material/Savings'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import InfoIcon from '@mui/icons-material/Info'
import DonutSmallIcon from '@mui/icons-material/DonutSmall'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { useAppSelector } from '@/store/hooks'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import { AccountType } from '@/typings/domain/enums'
import { computeSingleCardAvailable } from '@/utils/domain/computeCreditCardAvailable'
import { DonutChart } from '@/components/shared/DonutChart'
import { useReportsData } from '@/modules/reports/useReportsData'
import { ProjectionAreaChart } from './components/ProjectionAreaChart'
import { useProjectionData } from './useProjectionData'
import { ProjectionPeriodMode } from './typings/enums'

const CATEGORY_COLORS = ['#e2703a', '#e8b93f', '#2f8f8a', '#7a5aa8', '#3f6a8a', '#b7ada0']

type KpiTileProps = {
  icon: React.ReactNode
  label: string
  value: string
  valueColor: string
  sub?: string
}

function KpiTile({ icon, label, value, valueColor, sub }: KpiTileProps): React.JSX.Element {
  return (
    <Card
      sx={{
        p: 2.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: `1px solid ${organicColors.neutral.border}`
      }}
      elevation={0}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            flexShrink: 0,
            backgroundColor: organicColors.orange.tint,
            color: organicColors.orange.dark
          }}
        >
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography
        component="p"
        noWrap
        sx={{
          fontFamily: organicTypography.titleFontFamily,
          fontSize: '1.625rem',
          color: valueColor
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
    </Card>
  )
}

export function ProjectionPage(): React.JSX.Element {
  const [periodMode, setPeriodMode] = useState<ProjectionPeriodMode>(
    ProjectionPeriodMode.FROM_TODAY
  )
  const projectionData = useProjectionData(periodMode)
  const { categoryBreakdown } = useReportsData()
  const accounts = useAppSelector(selectAllAccounts)
  const cards = accounts.filter((account) => account.type === AccountType.CREDIT_CARD)

  const isFullMonth = periodMode === ProjectionPeriodMode.FULL_MONTH
  const hint = isFullMonth
    ? 'Este período toma el mes calendario completo, del 1 al último día del mes.'
    : 'Este período va desde hoy hasta el fin de mes, con tu saldo actual como punto de partida.'

  const totalExpenses = categoryBreakdown.reduce((sum, entry) => sum + entry.total, 0)
  const donutSegments = categoryBreakdown.slice(0, 6).map((entry, index) => ({
    label: entry.categoryName,
    amountLabel: formatCurrency(entry.total),
    percent: entry.percent,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
  }))

  return (
    <Stack spacing={3} component="section" aria-label="Proyección del mes">
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{ p: 2.25, height: '100%', border: `1px solid ${organicColors.neutral.border}` }}
            elevation={0}
          >
            <TextField
              label="Período"
              select
              size="small"
              value={periodMode}
              onChange={(event) => setPeriodMode(event.target.value as ProjectionPeriodMode)}
              sx={{ minWidth: 260 }}
            >
              <MenuItem value={ProjectionPeriodMode.FROM_TODAY}>
                Desde hoy hasta fin de mes
              </MenuItem>
              <MenuItem value={ProjectionPeriodMode.FULL_MONTH}>Mes calendario completo</MenuItem>
            </TextField>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              p: 2.25,
              height: '100%',
              display: 'flex',
              gap: 1.75,
              alignItems: 'center',
              backgroundColor: '#faf0e4',
              border: '1px solid #efdcc6'
            }}
            elevation={0}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                flexShrink: 0,
                backgroundColor: '#f2dcc3',
                color: organicColors.orange.dark
              }}
            >
              <InfoIcon fontSize="small" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {hint}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<SouthIcon fontSize="small" />}
            label="Te falta pagar"
            value={formatCurrency(projectionData.pendingTotal)}
            valueColor={organicColors.orange.dark}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<NorthIcon fontSize="small" />}
            label="Va a entrar"
            value={formatCurrency(projectionData.expectedIncome)}
            valueColor={organicColors.income.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<SavingsIcon fontSize="small" />}
            label={`Queda el ${projectionData.endOfMonthLabel}`}
            value={formatCurrency(projectionData.endOfMonthBalance)}
            valueColor={
              projectionData.isPositive ? organicColors.income.main : organicColors.overdue.main
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiTile
            icon={<AccountBalanceWalletIcon fontSize="small" />}
            label="Tenés hoy"
            value={formatCurrency(projectionData.todayBalance)}
            valueColor={organicColors.orange.dark}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            <ProjectionAreaChart series={projectionData.series} />
            <Card
              sx={{ p: 2.25, border: `1px solid ${organicColors.neutral.border}` }}
              elevation={0}
            >
              <Stack direction="row" alignItems="center" spacing={1.25} mb={2}>
                <DonutSmallIcon sx={{ color: organicColors.orange.dark }} />
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: organicTypography.titleFontFamily,
                    fontSize: '1.25rem',
                    color: organicColors.orange.dark
                  }}
                >
                  ¿En qué se va la plata?
                </Typography>
              </Stack>
              {donutSegments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Todavía no hay gastos este mes para mostrar por categoría.
                </Typography>
              ) : (
                <DonutChart
                  segments={donutSegments}
                  centerValue={formatCurrency(totalExpenses)}
                  centerLabel="Gastos totales"
                />
              )}
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Card
              sx={{ p: 2.25, border: `1px solid ${organicColors.neutral.border}` }}
              elevation={0}
            >
              <Stack direction="row" alignItems="center" spacing={1.25} mb={1.5}>
                <CreditCardIcon sx={{ color: organicColors.orange.dark }} />
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: organicTypography.titleFontFamily,
                    fontSize: '1.25rem',
                    color: organicColors.orange.dark
                  }}
                >
                  Tarjetas
                </Typography>
              </Stack>
              {cards.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tenés tarjetas cargadas.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {cards.map((card) => (
                    <Stack
                      key={card.id}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.25 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          backgroundColor: organicColors.blue.tint,
                          color: organicColors.blue.main
                        }}
                      >
                        <CreditCardIcon fontSize="small" />
                      </Box>
                      <Box flexGrow={1} minWidth={0}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {card.name}
                        </Typography>
                        {(card.closingDay || card.dueDay) && (
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {card.closingDay ? `Cierra el ${card.closingDay}` : ''}
                            {card.closingDay && card.dueDay ? ' · ' : ''}
                            {card.dueDay ? `Vence el ${card.dueDay}` : ''}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: organicTypography.titleFontFamily,
                          fontSize: '1rem',
                          color: organicColors.orange.dark,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {formatCurrency(computeSingleCardAvailable(card))}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Card>

            <Card
              sx={{
                p: 2.25,
                display: 'flex',
                gap: 1.75,
                alignItems: 'flex-start',
                backgroundColor: projectionData.isPositive
                  ? organicColors.income.tint
                  : organicColors.overdue.tint,
                border: `1px solid ${
                  projectionData.isPositive
                    ? organicColors.income.border
                    : organicColors.overdue.border
                }`
              }}
              elevation={0}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  backgroundColor: projectionData.isPositive
                    ? organicColors.income.iconBg
                    : organicColors.overdue.border,
                  color: projectionData.isPositive
                    ? organicColors.income.main
                    : organicColors.overdue.main
                }}
              >
                {projectionData.isPositive ? (
                  <EmojiEventsIcon fontSize="small" />
                ) : (
                  <WarningAmberIcon fontSize="small" />
                )}
              </Box>
              <Stack spacing={0.5} minWidth={0}>
                <Typography
                  component="p"
                  sx={{
                    fontFamily: organicTypography.titleFontFamily,
                    fontSize: '1.125rem',
                    color: projectionData.isPositive
                      ? organicColors.income.main
                      : organicColors.overdue.main
                  }}
                >
                  {projectionData.isPositive ? '¡Vas bien!' : 'Ojo con el mes'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: projectionData.isPositive
                      ? organicColors.income.main
                      : organicColors.overdue.main,
                    lineHeight: 1.5
                  }}
                >
                  {projectionData.isPositive
                    ? `Vas a quedar con ${formatCurrency(projectionData.endOfMonthBalance)} a favor. Podés pasar parte de ese saldo al plazo fijo si querés.`
                    : `Te va a faltar ${formatCurrency(Math.abs(projectionData.endOfMonthBalance))} para llegar a fin de mes. Revisá qué pagos podés mover o adelantar.`}
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
