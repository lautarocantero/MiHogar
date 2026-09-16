import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDayMonth } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath } from '@/router/routes'
import { AmountMode, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import type { PaymentRowProps } from '../typings/props'

export function PaymentRow({ payment, onEdit, onDelete }: PaymentRowProps): React.JSX.Element {
  const { day, month } = formatDayMonth(payment.displayDate)
  const isPaid = payment.status === PaymentStatus.PAID
  const isDeposit = payment.kind === PaymentKind.DEPOSIT
  const isVariableUnset = payment.amountMode === AmountMode.VARIABLE && payment.amount === 0
  const accentColor = isDeposit ? organicColors.sage : organicColors.orange
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  return (
    <Card component="li" sx={{ p: 2, listStyle: 'none' }} elevation={0}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{
            bgcolor: isPaid ? organicColors.neutral.border : accentColor.tint,
            color: isPaid ? organicColors.neutral.textSecondary : accentColor.dark,
            width: 56,
            height: 56
          }}
        >
          <Box textAlign="center" lineHeight={1.1}>
            <Typography variant="body2" component="div" fontWeight={700}>
              {day}
            </Typography>
            <Typography variant="caption" component="div">
              {month}
            </Typography>
          </Box>
        </Avatar>
        <Box flexGrow={1}>
          <Typography variant="h6" component="p">
            {payment.concept}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payment.entity} · {payment.accountName}
          </Typography>
        </Box>
        <Chip
          label={payment.ownerLabel}
          size="small"
          sx={{ backgroundColor: organicColors.orange.tint, color: organicColors.orange.dark }}
        />
        <Typography variant="h6" component="p" color={accentColor.dark} minWidth={110}>
          {isVariableUnset ? 'A confirmar' : formatCurrency(payment.amount)}
        </Typography>
        <Button component={RouterLink} to={buildPaymentDetailPath(payment.id)} variant="outlined">
          Ver
        </Button>
        <IconButton
          size="small"
          aria-label={`Opciones de ${payment.concept}`}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
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
        </Menu>
      </Stack>
    </Card>
  )
}
