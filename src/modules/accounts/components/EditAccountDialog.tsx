import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { EditAccountForm } from './EditAccountForm'
import { useUpdateAccount } from '../useUpdateAccount'
import type { EditAccountDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'
import { useT } from '@/i18n'

export function EditAccountDialog({
  account,
  open,
  onClose
}: EditAccountDialogProps): React.JSX.Element {
  const t = useT()
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useUpdateAccount(account, onClose)

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-account-title"
    >
      <DialogHeader id="edit-account-title" onClose={onClose}>
        {t('accounts.editAccount')}
      </DialogHeader>
      <DialogContent>
        <EditAccountForm
          account={account}
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
