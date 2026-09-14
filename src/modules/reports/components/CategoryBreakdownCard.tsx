import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { CategoryBreakdownCardProps } from '../typings/props'

export function CategoryBreakdownCard({ entries }: CategoryBreakdownCardProps): React.JSX.Element {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Todavía no hay gastos este mes para mostrar por categoría.
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      {entries.map((entry) => (
        <Box key={entry.categoryId}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="body1">{entry.categoryName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(entry.total)} · {entry.percent}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={entry.percent}
            sx={{
              height: 10,
              borderRadius: 999,
              backgroundColor: organicColors.neutral.border,
              '& .MuiLinearProgress-bar': {
                backgroundColor: organicColors.orange.main,
                borderRadius: 999
              }
            }}
          />
        </Box>
      ))}
    </Stack>
  )
}
