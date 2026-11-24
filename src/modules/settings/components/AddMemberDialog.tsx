import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { AddMemberForm } from './AddMemberForm'
import { useAddMember } from '../useAddMember'
import type { AddMemberDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'
import { useT } from '@/i18n'

export function AddMemberDialog({
  open,
  onClose,
  onCreated
}: AddMemberDialogProps): React.JSX.Element {
  const t = useT()
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useAddMember((memberId) => {
    onCreated?.(memberId)
    onClose()
  })

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="add-member-title"
    >
      <DialogHeader id="add-member-title" onClose={onClose}>
        {t('settings.members.dialogTitle')}
      </DialogHeader>
      <DialogContent>
        <AddMemberForm
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
