import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { EditPaymentForm } from './EditPaymentForm'
import { useUpdatePayment } from '../useUpdatePayment'
import type { EditPaymentDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'
import { useT } from '@/i18n'

export function EditPaymentDialog({
  payment,
  open,
  onClose
}: EditPaymentDialogProps): React.JSX.Element {
  const t = useT()
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useUpdatePayment(payment, onClose)

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="edit-payment-title"
    >
      <DialogHeader id="edit-payment-title" onClose={onClose}>
        {t('payments.editTitle')}
      </DialogHeader>
      <DialogContent>
        <EditPaymentForm
          payment={payment}
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
