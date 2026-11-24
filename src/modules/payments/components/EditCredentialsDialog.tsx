import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { EditCredentialsForm } from './EditCredentialsForm'
import { useUpdateCredentials } from '../useUpdateCredentials'
import type { EditCredentialsDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'
import { useT } from '@/i18n'

export function EditCredentialsDialog({
  payment,
  open,
  onClose
}: EditCredentialsDialogProps): React.JSX.Element {
  const t = useT()
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useUpdateCredentials(payment, onClose)

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-credentials-title"
    >
      <DialogHeader id="edit-credentials-title" onClose={onClose}>
        {t('payments.credentials.title')}
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
