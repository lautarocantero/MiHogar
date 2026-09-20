import { Box, Stack, Typography } from '@mui/material'
import SavingsIcon from '@mui/icons-material/Savings'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import EcoIcon from '@mui/icons-material/Spa'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { MonthSummaryCardProps } from '../typings/props'

const ICONS: Record<string, React.ElementType> = {
  savings: SavingsIcon,
  account_balance: AccountBalanceIcon,
  eco: EcoIcon
}

export function MonthSummaryCard({ items }: MonthSummaryCardProps): React.JSX.Element {
  return (
    <Stack spacing={1.25} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? SavingsIcon
        const isPositiveTint = item.icon === 'eco'
        return (
          <Stack
            key={item.key}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.75}
            sx={{
              border: `1px solid ${organicColors.neutral.border}`,
              p: 1.5,
              backgroundColor: organicColors.surface
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                flexShrink: 0,
                backgroundColor: isPositiveTint
                  ? organicColors.income.iconBg
                  : organicColors.orange.tint,
                color: isPositiveTint ? organicColors.income.main : organicColors.orange.dark
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Typography flex={1} minWidth={0} noWrap fontSize="0.875rem" sx={{ color: '#4a382a' }}>
              {item.label}
            </Typography>
            <Stack alignItems="flex-end" spacing={0.25}>
              <Typography fontWeight={700} fontSize="0.875rem" whiteSpace="nowrap">
                {formatCurrency(item.amount)}
              </Typography>
              {item.deltaPercent != null && (
                <Typography variant="caption" sx={{ color: organicColors.income.main }}>
                  {item.deltaPercent >= 0 ? '↑' : '↓'} {Math.abs(Math.round(item.deltaPercent))}%
                </Typography>
              )}
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}
