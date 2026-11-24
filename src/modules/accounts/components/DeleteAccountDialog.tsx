import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useAppSelector } from '@/store/hooks'
import { selectMovementsByAccountId } from '@/store/movements/movementsSelectors'
import { selectPaymentsByAccountId } from '@/store/payments/paymentsSelectors'
import { useDeleteAccount } from '../useDeleteAccount'
import type { DeleteAccountDialogProps } from '../typings/props'
import { useT } from '@/i18n'

export function DeleteAccountDialog({
  account,
  open,
  onClose
}: DeleteAccountDialogProps): React.JSX.Element {
  const t = useT()
  const relatedMovements = useAppSelector((state) => selectMovementsByAccountId(state, account.id))
  const relatedPayments = useAppSelector((state) => selectPaymentsByAccountId(state, account.id))
  const { submit, isSubmitting, errorMessage } = useDeleteAccount(account, onClose)

  const hasReferences = relatedMovements.length > 0 || relatedPayments.length > 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-account-title"
    >
      <DialogHeader id="delete-account-title" onClose={onClose}>
        {t('accounts.delete.title', { name: account.name })}
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>
          {hasReferences && (
            <Alert severity="warning">
              {t('accounts.delete.warning', {
                movements: relatedMovements.length,
                payments: relatedPayments.length
              })}
            </Alert>
          )}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={submit} color="error" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.deleting') : t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
