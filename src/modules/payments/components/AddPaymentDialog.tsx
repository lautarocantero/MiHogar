import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { PaymentKind } from '@/typings/domain/enums'
import { AddPaymentForm } from './AddPaymentForm'
import { useCreatePayment } from '../useCreatePayment'
import type { AddPaymentDialogProps } from '../typings/props'

export function AddPaymentDialog({
  kind,
  open,
  onClose
}: AddPaymentDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreatePayment(kind, onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="add-payment-title"
    >
      <DialogTitle id="add-payment-title">
        {kind === PaymentKind.DEPOSIT ? 'Agregar un depósito fijo' : 'Agregar un pago fijo'}
      </DialogTitle>
      <DialogContent>
        <AddPaymentForm
          kind={kind}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
