import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { AddAccountForm } from './AddAccountForm'
import { useCreateAccount } from '../useCreateAccount'
import type { AddAccountDialogProps } from '../typings/props'
import { useFullScreenDialog } from '@/hooks/shared/useResponsive'
import { useT } from '@/i18n'

export function AddAccountDialog({ open, onClose }: AddAccountDialogProps): React.JSX.Element {
  const t = useT()
  const fullScreen = useFullScreenDialog()
  const { submit, isSubmitting, errorMessage } = useCreateAccount(onClose)

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="add-account-title"
    >
      <DialogHeader id="add-account-title" onClose={onClose}>
        {t('accounts.addAccount')}
      </DialogHeader>
      <DialogContent>
        <AddAccountForm
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
