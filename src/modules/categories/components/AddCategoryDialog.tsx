import { Dialog, DialogContent } from '@mui/material'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { CategoryKind } from '@/typings/domain/enums'
import { AddCategoryForm } from './AddCategoryForm'
import { useAddCategory } from '../useAddCategory'
import type { AddCategoryDialogProps } from '../typings/props'

export function AddCategoryDialog({
  kind,
  open,
  onClose,
  onCreated
}: AddCategoryDialogProps): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useAddCategory(kind, (categoryId) => {
    onCreated?.(categoryId)
    onClose()
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="add-category-title"
    >
      <DialogHeader id="add-category-title" onClose={onClose}>
        {kind === CategoryKind.INCOME ? 'Agregar concepto de ingreso' : 'Agregar concepto de gasto'}
      </DialogHeader>
      <DialogContent>
        <AddCategoryForm
          onSubmit={submit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  )
}
