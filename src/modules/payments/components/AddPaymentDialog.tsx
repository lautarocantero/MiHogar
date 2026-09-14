import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { AddPaymentForm } from './AddPaymentForm'
import { useCreatePayment } from '../useCreatePayment'
import type { AddPaymentDialogProps } from '../typings/props'

export function AddPaymentDialog({ open, onClose }: AddPaymentDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreatePayment(onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="add-payment-title"
    >
      <DialogTitle id="add-payment-title">Agregar un pago</DialogTitle>
      <DialogContent>
        <AddPaymentForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      </DialogContent>
    </Dialog>
  )
}
