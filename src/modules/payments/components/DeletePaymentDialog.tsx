import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useAppSelector } from '@/store/hooks'
import { selectMovementsByPaymentId } from '@/store/movements/movementsSelectors'
import { useDeletePayment } from '../useDeletePayment'
import type { DeletePaymentDialogProps } from '../typings/props'
import { useT } from '@/i18n'

export function DeletePaymentDialog({
  payment,
  open,
  onClose,
  onDeleted
}: DeletePaymentDialogProps): React.JSX.Element {
  const t = useT()
  const relatedMovements = useAppSelector((state) => selectMovementsByPaymentId(state, payment.id))
  const { submit, isSubmitting, errorMessage } = useDeletePayment(payment, onDeleted)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-payment-title"
    >
      <DialogHeader id="delete-payment-title" onClose={onClose}>
        {t('payments.delete.title', { name: payment.concept })}
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>
          {relatedMovements.length > 0 && (
            <Alert severity="warning">
              {t('payments.delete.warning', { count: relatedMovements.length })}
            </Alert>
          )}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={submit} color="error" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
