import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
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
      maxWidth="md"
      aria-labelledby="add-account-title"
    >
      <DialogHeader id="add-account-title" onClose={onClose}>
        Agregar una cuenta
      </DialogHeader>
      <DialogContent>
        <AddAccountForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      </DialogContent>
    </Dialog>
  )
}
