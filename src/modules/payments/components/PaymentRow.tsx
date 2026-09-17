import { Avatar, Box, Card, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import UndoIcon from '@mui/icons-material/Undo'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDayMonth } from '@/utils/formatting/formatDate'
import { buildPaymentDetailPath } from '@/router/routes'
import { AmountMode, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import { computeInstallmentsRemaining } from '@/utils/domain/computeInstallmentsRemaining'
import { useMarkPaymentAsPaid } from '../hooks/useMarkPaymentAsPaid'
import { useCancelPayment } from '../hooks/useCancelPayment'
import type { PaymentRowProps } from '../typings/props'

export function PaymentRow({ payment, onEdit, onDelete }: PaymentRowProps): React.JSX.Element {
  const { day, month } = formatDayMonth(payment.displayDate)
  const isPaid = payment.status === PaymentStatus.PAID
  const isDeposit = payment.kind === PaymentKind.DEPOSIT
  const isVariableUnset = payment.amountMode === AmountMode.VARIABLE && payment.amount === 0
  const accentColor = isDeposit ? organicColors.sage : organicColors.orange
  const { markAsPaid, isSubmitting: isMarkingPaid } = useMarkPaymentAsPaid(payment)
  const { cancel, isSubmitting: isCancelling } = useCancelPayment(payment)
  const installmentsRemaining = computeInstallmentsRemaining(payment)

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
            {typeof installmentsRemaining === 'number' &&
              ` · cuota ${(payment.installmentsPaid ?? 0) + 1}/${payment.installmentsTotal}`}
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
        <Tooltip title="Ver">
          <IconButton
            component={RouterLink}
            to={buildPaymentDetailPath(payment.id)}
            aria-label={`Ver ${payment.concept}`}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {isPaid ? (
          <Tooltip title={isDeposit ? 'Cancelar cobro' : 'Cancelar pago'}>
            <span>
              <IconButton
                aria-label={`Cancelar ${payment.concept}`}
                onClick={cancel}
                disabled={isCancelling}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title={isDeposit ? 'Marcar como cobrado' : 'Marcar como pagado'}>
            <span>
              <IconButton
                aria-label={`Marcar ${payment.concept} como ${isDeposit ? 'cobrado' : 'pagado'}`}
                onClick={markAsPaid}
                disabled={isMarkingPaid || isVariableUnset}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title="Editar">
          <IconButton aria-label={`Editar ${payment.concept}`} onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton aria-label={`Eliminar ${payment.concept}`} onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  )
}
