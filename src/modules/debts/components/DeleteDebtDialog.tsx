import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { useDeleteDebt } from '../useDeleteDebt'
import type { DeleteDebtDialogProps } from '../typings/props'

export function DeleteDebtDialog({
  debt,
  open,
  onClose,
  onDeleted
}: DeleteDebtDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useDeleteDebt(debt, onDeleted)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-debt-title"
    >
      <DialogHeader id="delete-debt-title" onClose={onClose}>
        Eliminar &quot;{debt.name}&quot;
      </DialogHeader>
      <DialogContent>
        <Stack spacing={2}>{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</Stack>
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
