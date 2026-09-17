import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useAppSelector } from '@/store/hooks'
import { selectMovementsByPaymentId } from '@/store/movements/movementsSelectors'
import { useDeletePayment } from '../useDeletePayment'
import type { DeletePaymentDialogProps } from '../typings/props'

export function DeletePaymentDialog({
  payment,
  open,
  onClose,
  onDeleted
}: DeletePaymentDialogProps): React.JSX.Element {
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
        Eliminar &quot;{payment.concept}&quot;
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>
          {relatedMovements.length > 0 && (
            <Alert severity="warning">
              Este pago generó {relatedMovements.length} movimiento(s) al marcarse como pagado. Van
              a seguir existiendo, pero sin el pago asociado.
            </Alert>
          )}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={submit} color="error" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Eliminando…' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
