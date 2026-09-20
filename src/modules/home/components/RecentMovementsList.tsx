import { Box, Card, Stack, Typography } from '@mui/material'
import { MovementType } from '@/typings/domain/enums'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { RecentMovementsListProps } from '../typings/props'

function getMovementColor(type: MovementType): string {
  if (type === MovementType.INCOME) {
    return organicColors.sage.main
  }
  if (type === MovementType.EXPENSE) {
    return organicColors.orange.main
  }
  return organicColors.neutral.textSecondary
}

function getSignedAmountLabel(type: MovementType, amount: number): string {
  const sign = type === MovementType.INCOME ? '+' : type === MovementType.EXPENSE ? '−' : ''
  return `${sign} ${formatCurrency(Math.abs(amount))}`
}

export function RecentMovementsList({ movements }: RecentMovementsListProps): React.JSX.Element {
  if (movements.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Todavía no anotaste ningún movimiento.
      </Typography>
    )
  }

  return (
    <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {movements.map(({ movement, accountName }) => (
        <Card key={movement.id} component="li" sx={{ p: 2 }} elevation={0}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              width={12}
              height={12}
              borderRadius="50%"
              bgcolor={getMovementColor(movement.type)}
              aria-hidden="true"
            />
            <Box flexGrow={1}>
              <Typography variant="body1">{movement.note ?? accountName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {accountName} · {movement.date}
              </Typography>
            </Box>
            <Typography
              component="p"
              sx={{
                fontFamily: organicTypography.titleFontFamily,
                fontSize: '1.1875rem',
                whiteSpace: 'nowrap',
                color: getMovementColor(movement.type)
              }}
            >
              {getSignedAmountLabel(movement.type, movement.amount)}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}
