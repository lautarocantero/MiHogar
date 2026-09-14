import { Card, LinearProgress, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { MonthlyProgressCardProps } from '../typings/props'

export function MonthlyProgressCard({
  monthLabel,
  progress
}: MonthlyProgressCardProps): React.JSX.Element {
  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={1.5}>
        <Typography variant="body1" color="text.secondary">
          Total a pagar en {monthLabel}
        </Typography>
        <Typography variant="h4" component="p">
          {formatCurrency(progress.totalDue)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress.progressPercent}
          sx={{
            height: 10,
            borderRadius: 999,
            backgroundColor: organicColors.neutral.border,
            '& .MuiLinearProgress-bar': {
              backgroundColor: organicColors.sage.main,
              borderRadius: 999
            }
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Ya pagaste {formatCurrency(progress.paidSoFar)} de los {formatCurrency(progress.totalDue)}{' '}
          del mes.
        </Typography>
      </Stack>
    </Card>
  )
}
