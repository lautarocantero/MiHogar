import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { EditAccountForm } from './EditAccountForm'
import { useUpdateAccount } from '../useUpdateAccount'
import type { EditAccountDialogProps } from '../typings/props'

export function EditAccountDialog({
  account,
  open,
  onClose
}: EditAccountDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useUpdateAccount(account, onClose)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-account-title"
    >
      <DialogTitle id="edit-account-title">Editar cuenta</DialogTitle>
      <DialogContent>
        <EditAccountForm
          account={account}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
