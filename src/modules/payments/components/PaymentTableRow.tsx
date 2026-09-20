import { Chip, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
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
import { AccountType, AmountMode, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import { computeInstallmentsRemaining } from '@/utils/domain/computeInstallmentsRemaining'
import { useMarkPaymentAsPaid } from '../hooks/useMarkPaymentAsPaid'
import { useCancelPayment } from '../hooks/useCancelPayment'
import type { PaymentTableRowProps } from '../typings/props'

export function PaymentTableRow({
  entry,
  isFocused,
  hiddenColumns,
  rowRef,
  onEditPayment,
  onDeletePayment,
  onEditMovement,
  onDeleteMovement
}: PaymentTableRowProps): React.JSX.Element {
  const payment = entry.origin === 'payment' ? entry : null
  const { day, month } = formatDayMonth(entry.displayDate)
  const isPaid = entry.status === PaymentStatus.PAID
  const isDeposit = payment?.kind === PaymentKind.DEPOSIT
  const isVariableUnset = payment?.amountMode === AmountMode.VARIABLE && payment.amount === 0
  const { markAsPaid, isSubmitting: isMarkingPaid } = useMarkPaymentAsPaid(payment)
  const { cancel, isSubmitting: isCancelling } = useCancelPayment(payment)
  const installmentsRemaining = payment ? computeInstallmentsRemaining(payment) : null
  const isCard = entry.accountType === AccountType.CREDIT_CARD

  return (
    <TableRow
      ref={rowRef}
      hover
      sx={{ backgroundColor: isFocused ? organicColors.blue.tint : 'inherit' }}
    >
      {!hiddenColumns.has('date') && (
        <TableCell>
          {day} {month}
        </TableCell>
      )}
      {!hiddenColumns.has('title') && (
        <TableCell>
          <Typography variant="body2">{entry.concept}</Typography>
          {typeof installmentsRemaining === 'number' && payment && (
            <Typography variant="caption" color="text.secondary">
              cuota {(payment.installmentsPaid ?? 0) + 1}/{payment.installmentsTotal}
            </Typography>
          )}
        </TableCell>
      )}
      {!hiddenColumns.has('status') && (
        <TableCell>
          <Chip
            label={isPaid ? 'Pagado' : 'Pendiente'}
            size="small"
            sx={
              isPaid
                ? { backgroundColor: organicColors.paid.tint, color: organicColors.paid.main }
                : { backgroundColor: organicColors.overdue.tint, color: organicColors.overdue.main }
            }
          />
        </TableCell>
      )}
      {!hiddenColumns.has('method') && <TableCell>{isCard ? 'Tarjeta' : 'Efectivo'}</TableCell>}
      {!hiddenColumns.has('type') && (
        <TableCell>{entry.recurring ? 'Recurrente' : 'Único'}</TableCell>
      )}
      {!hiddenColumns.has('account') && <TableCell>{entry.accountName}</TableCell>}
      {!hiddenColumns.has('category') && <TableCell>{entry.categoryName}</TableCell>}
      {!hiddenColumns.has('owner') && (
        <TableCell>
          <Chip
            label={entry.ownerLabel}
            size="small"
            sx={{ backgroundColor: organicColors.orange.tint, color: organicColors.orange.dark }}
          />
        </TableCell>
      )}
      {!hiddenColumns.has('mode') && (
        <TableCell>
          {entry.amountMode === AmountMode.VARIABLE
            ? 'Variable'
            : entry.amountMode === AmountMode.FIXED
              ? 'Fijo'
              : '—'}
        </TableCell>
      )}
      <TableCell align="right">
        <Typography
          variant="body2"
          fontWeight={600}
          color={isDeposit ? organicColors.sage.dark : organicColors.orange.dark}
        >
          {isVariableUnset ? 'A confirmar' : formatCurrency(entry.amount)}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {payment && (
          <Tooltip title="Ver">
            <IconButton
              component={RouterLink}
              to={buildPaymentDetailPath(payment.id)}
              aria-label={`Ver ${payment.concept}`}
              size="small"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {payment &&
          (isPaid ? (
            <Tooltip title={isDeposit ? 'Cancelar cobro' : 'Cancelar pago'}>
              <span>
                <IconButton
                  aria-label={`Cancelar ${payment.concept}`}
                  onClick={cancel}
                  disabled={isCancelling}
                  size="small"
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
                  size="small"
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          ))}
        <Tooltip title="Editar">
          <IconButton
            aria-label={`Editar ${entry.concept}`}
            onClick={() =>
              entry.origin === 'payment' ? onEditPayment(entry) : onEditMovement(entry.movement)
            }
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton
            aria-label={`Eliminar ${entry.concept}`}
            onClick={() =>
              entry.origin === 'payment' ? onDeletePayment(entry) : onDeleteMovement(entry.movement)
            }
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
