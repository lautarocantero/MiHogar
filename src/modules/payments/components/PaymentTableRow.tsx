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
import { useT } from '@/i18n'

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
  const t = useT()
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {day} {month}
        </TableCell>
      )}
      {!hiddenColumns.has('title') && (
        <TableCell>
          <Typography variant="body2">{entry.concept}</Typography>
          {typeof installmentsRemaining === 'number' && payment && (
            <Typography variant="caption" color="text.secondary">
              {installmentsRemaining > 0
                ? t('payments.row.installment', {
                    current: (payment.installmentsPaid ?? 0) + 1,
                    total: payment.installmentsTotal ?? 0
                  })
                : t('payments.row.finishPaying', { concept: payment.concept })}
            </Typography>
          )}
        </TableCell>
      )}
      {!hiddenColumns.has('status') && (
        <TableCell>
          <Chip
            label={isPaid ? t('payments.status.paid') : t('payments.status.pending')}
            size="small"
            sx={
              isPaid
                ? { backgroundColor: organicColors.paid.tint, color: organicColors.paid.main }
                : { backgroundColor: organicColors.overdue.tint, color: organicColors.overdue.main }
            }
          />
        </TableCell>
      )}
      {!hiddenColumns.has('method') && <TableCell>{isCard ? t('payments.method.card') : t('payments.method.cash')}</TableCell>}
      {!hiddenColumns.has('type') && (
        <TableCell>{entry.recurring ? t('payments.type.recurring') : t('payments.type.oneOff')}</TableCell>
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
            ? t('payments.mode.variable')
            : entry.amountMode === AmountMode.FIXED
              ? t('payments.mode.fixed')
              : '—'}
        </TableCell>
      )}
      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color={isDeposit ? organicColors.sage.dark : organicColors.orange.dark}
        >
          {isVariableUnset ? t('payments.toConfirm') : formatCurrency(entry.amount)}
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
        {payment && (
          <Tooltip title={t('payments.action.view')}>
            <IconButton
              component={RouterLink}
              to={buildPaymentDetailPath(payment.id)}
              aria-label={t('payments.action.viewItem', { name: payment.concept })}
              size="small"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {payment &&
          (isPaid ? (
            <Tooltip
              title={isDeposit ? t('payments.action.cancelDeposit') : t('payments.action.cancelPayment')}
            >
              <span>
                <IconButton
                  aria-label={t('payments.action.cancelItem', { name: payment.concept })}
                  onClick={cancel}
                  disabled={isCancelling}
                  size="small"
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip
              title={isDeposit ? t('payments.action.markCollected') : t('payments.action.markPaid')}
            >
              <span>
                <IconButton
                  aria-label={t(
                    isDeposit ? 'payments.action.markCollectedItem' : 'payments.action.markPaidItem',
                    { name: payment.concept }
                  )}
                  onClick={markAsPaid}
                  disabled={isMarkingPaid || isVariableUnset}
                  size="small"
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          ))}
        <Tooltip title={t('common.edit')}>
          <IconButton
            aria-label={t('payments.action.editItem', { name: entry.concept })}
            onClick={() =>
              entry.origin === 'payment' ? onEditPayment(entry) : onEditMovement(entry.movement)
            }
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('common.delete')}>
          <IconButton
            aria-label={t('payments.action.deleteItem', { name: entry.concept })}
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
