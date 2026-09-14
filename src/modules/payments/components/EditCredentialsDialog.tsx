import { Dialog, DialogContent, DialogTitle } from '@mui/material'
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
      <DialogTitle id="edit-credentials-title">Datos para entrar</DialogTitle>
      <DialogContent>
        <EditCredentialsForm
          payment={payment}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
