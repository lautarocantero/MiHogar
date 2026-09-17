import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { EditCredentialsForm } from './EditCredentialsForm'
import { useUpdateCredentials } from '../useUpdateCredentials'
import type { EditCredentialsDialogProps } from '../typings/props'

export function EditCredentialsDialog({
  payment,
  open,
  onClose
}: EditCredentialsDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useUpdateCredentials(payment, onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-credentials-title"
    >
      <DialogHeader id="edit-credentials-title" onClose={onClose}>
        Datos para entrar
      </DialogHeader>
      <DialogContent>
        <EditCredentialsForm
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
