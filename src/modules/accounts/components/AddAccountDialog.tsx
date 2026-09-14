import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { AddAccountForm } from './AddAccountForm'
import { useCreateAccount } from '../useCreateAccount'
import type { AddAccountDialogProps } from '../typings/props'

export function AddAccountDialog({ open, onClose }: AddAccountDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateAccount(onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="add-account-title"
    >
      <DialogTitle id="add-account-title">Agregar una cuenta</DialogTitle>
      <DialogContent>
        <AddAccountForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      </DialogContent>
    </Dialog>
  )
}
