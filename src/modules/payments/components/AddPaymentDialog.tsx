import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
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
      maxWidth="lg"
      aria-labelledby="add-payment-title"
    >
      <DialogHeader id="add-payment-title" onClose={onClose}>
        {kind === PaymentKind.DEPOSIT ? 'Agregar un depósito fijo' : 'Agregar un pago fijo'}
      </DialogHeader>
      <DialogContent>
        <AddPaymentForm
          kind={kind}
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
