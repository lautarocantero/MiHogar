import { useState } from 'react'
import { Box, Card, Chip, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { MovementType } from '@/typings/domain/enums'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatShortDate } from '@/utils/formatting/formatDate'
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

export function TimelineEntryCard({
  entry,
  onEdit,
  onDelete
}: TimelineEntryCardProps): React.JSX.Element {
  const { movement, concept, detail, isEstimated, isPast } = entry
  const shortDate = formatShortDate(movement.date)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const comesFromPayment = Boolean(movement.paymentId)

  return (
    <Stack direction="row" spacing={2}>
      <Box width={64} textAlign="center" flexShrink={0}>
        <Typography variant="body2" color={isPast ? 'text.secondary' : 'text.primary'}>
          {shortDate}
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
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="h6" component="p" color={getDotColor(movement.type)}>
              {getSignedAmountLabel(movement.type, movement.amount)}
            </Typography>
            <IconButton
              size="small"
              aria-label={`Opciones de ${concept}`}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              {comesFromPayment ? (
                <MenuItem disabled>Viene de un pago, editalo desde Pagos</MenuItem>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null)
                      onEdit()
                    }}
                  >
                    Editar
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null)
                      onDelete()
                    }}
                  >
                    Eliminar
                  </MenuItem>
                </>
              )}
            </Menu>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}
