import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EditPaymentForm } from './EditPaymentForm'
import { useUpdatePayment } from '../useUpdatePayment'
import type { EditPaymentDialogProps } from '../typings/props'

export function EditPaymentDialog({
  payment,
  open,
  onClose
}: EditPaymentDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useUpdatePayment(payment, onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-payment-title"
    >
      <DialogTitle id="edit-payment-title">Editar pago</DialogTitle>
      <DialogContent>
        <EditPaymentForm
          payment={payment}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
