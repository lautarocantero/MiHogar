import { Box, Card, Chip, Stack, Typography } from '@mui/material'
import { MovementType } from '@/typings/domain/enums'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDayMonth } from '@/utils/formatting/formatDate'
import type { TimelineEntryCardProps } from '../typings/props'

function getDotColor(type: MovementType): string {
  if (type === MovementType.INCOME) {
    return organicColors.sage.main
  }
  if (type === MovementType.EXPENSE) {
    return organicColors.orange.main
  }
  return organicColors.neutral.textSecondary
}

function getSignedAmountLabel(type: MovementType, amount: number): string {
  if (type === MovementType.INCOME) {
    return `+ ${formatCurrency(amount)}`
  }
  if (type === MovementType.EXPENSE) {
    return `− ${formatCurrency(amount)}`
  }
  return formatCurrency(amount)
}

export function TimelineEntryCard({ entry }: TimelineEntryCardProps): React.JSX.Element {
  const { movement, concept, detail, isEstimated, isPast } = entry
  const { day, month } = formatDayMonth(movement.date)

  return (
    <Stack direction="row" spacing={2} component="li" sx={{ listStyle: 'none' }}>
      <Box width={56} textAlign="center" flexShrink={0}>
        <Typography variant="h6" component="div" color={isPast ? 'text.secondary' : 'text.primary'}>
          {day}
        </Typography>
        <Typography variant="caption" color="text.secondary" textTransform="capitalize">
          {month}
        </Typography>
      </Box>
      <Box
        width={12}
        height={12}
        borderRadius="50%"
        bgcolor={getDotColor(movement.type)}
        mt={0.75}
        flexShrink={0}
        aria-hidden="true"
      />
      <Card sx={{ p: 2, flexGrow: 1, opacity: isPast ? 0.7 : 1 }} elevation={0}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1">{concept}</Typography>
              {isEstimated && <Chip label="estimado" size="small" variant="outlined" />}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {detail}
            </Typography>
          </Box>
          <Typography variant="h6" component="p" color={getDotColor(movement.type)}>
            {getSignedAmountLabel(movement.type, movement.amount)}
          </Typography>
        </Stack>
      </Card>
    </Stack>
  )
}
