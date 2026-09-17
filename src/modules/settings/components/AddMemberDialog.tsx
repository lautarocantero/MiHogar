import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { AddMemberForm } from './AddMemberForm'
import { useAddMember } from '../useAddMember'
import type { AddMemberDialogProps } from '../typings/props'

export function AddMemberDialog({
  open,
  onClose,
  onCreated
}: AddMemberDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useAddMember((memberId) => {
    onCreated?.(memberId)
    onClose()
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="add-member-title"
    >
      <DialogHeader id="add-member-title" onClose={onClose}>
        Agregar quién usa la app
      </DialogHeader>
      <DialogContent>
        <AddMemberForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      </DialogContent>
    </Dialog>
  )
}
