import { Box, Card, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SavingsIcon from '@mui/icons-material/Savings'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import FlagIcon from '@mui/icons-material/Flag'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { SavingsSummaryCardsProps } from '../typings/props'

function SummaryTile({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor,
  background,
  borderColor
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  label: string
  value: string
  valueColor: string
  background: string
  borderColor: string
}): React.JSX.Element {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2.5,
        backgroundColor: background,
        border: `1px solid ${borderColor}`
      }}
      elevation={0}
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
      <Box minWidth={0}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          component="p"
          noWrap
          sx={{
            fontFamily: organicTypography.titleFontFamily,
            fontSize: '1.75rem',
            color: valueColor
          }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  )
}

export function SavingsSummaryCards({ summary }: SavingsSummaryCardsProps): React.JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <SummaryTile
          icon={<SavingsIcon />}
          iconBg="#f6e0cd"
          iconColor={organicColors.orange.dark}
          label="Tenés ahorrado"
          value={formatCurrency(summary.totalSaved)}
          valueColor={organicColors.orange.dark}
          background={organicColors.surface}
          borderColor={organicColors.neutral.border}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <SummaryTile
          icon={<TrendingUpIcon />}
          iconBg={organicColors.income.iconBg}
          iconColor={organicColors.income.main}
          label="En inversiones"
          value={formatCurrency(summary.totalInvested)}
          valueColor={organicColors.income.main}
          background={organicColors.income.tint}
          borderColor={organicColors.income.border}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <SummaryTile
          icon={<FlagIcon />}
          iconBg="#f6e0cd"
          iconColor={organicColors.orange.dark}
          label="Próximo vencimiento"
          value={summary.nextMaturityLabel ?? 'Sin vencimientos'}
          valueColor={organicColors.orange.dark}
          background={organicColors.surface}
          borderColor={organicColors.neutral.border}
        />
      </Grid>
    </Grid>
  )
}
