import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack
} from '@mui/material'
import { useAppSelector } from '@/store/hooks'
import { selectMovementsByAccountId } from '@/store/movements/movementsSelectors'
import { selectPaymentsByAccountId } from '@/store/payments/paymentsSelectors'
import { useDeleteAccount } from '../useDeleteAccount'
import type { DeleteAccountDialogProps } from '../typings/props'

export function DeleteAccountDialog({
  account,
  open,
  onClose
}: DeleteAccountDialogProps): React.JSX.Element {
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
      <DialogTitle id="delete-account-title">Eliminar &quot;{account.name}&quot;</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {hasReferences && (
            <Alert severity="warning">
              Esta cuenta tiene {relatedMovements.length} movimiento(s) y {relatedPayments.length}{' '}
              pago(s) asociados. Van a seguir existiendo, pero sin la cuenta.
            </Alert>
          )}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={submit} color="error" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Eliminando…' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
