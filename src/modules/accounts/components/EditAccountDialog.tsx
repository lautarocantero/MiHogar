import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
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
      maxWidth="md"
      aria-labelledby="edit-account-title"
    >
      <DialogHeader id="edit-account-title" onClose={onClose}>
        Editar cuenta
      </DialogHeader>
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
