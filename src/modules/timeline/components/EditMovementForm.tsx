import { Alert, Box, Button, MenuItem, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quickAddFormSchema } from '@/validation/quickAddFormSchema'
import { MovementType } from '@/typings/domain/enums'
import { resolveMovementTypeLabel } from '@/utils/domain/resolveMovementTypeLabel'
import { MovementFormFields } from './MovementFormFields'
import type { EditMovementFormProps } from '../typings/props'
import type { QuickAddFormValues } from '@/modules/quickAdd/typings/types'

const MOVEMENT_TYPES = [MovementType.EXPENSE, MovementType.INCOME, MovementType.TRANSFER]

export function EditMovementForm({
  movement,
  onSubmit,
  isSubmitting,
  errorMessage
}: EditMovementFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<QuickAddFormValues>({
    resolver: zodResolver(quickAddFormSchema),
    defaultValues: {
      type: movement.type,
      amount: movement.amount,
      date: movement.date,
      categoryId: movement.categoryId ?? '',
      accountId: movement.accountId,
      toAccountId: movement.toAccountId ?? '',
      note: movement.note ?? ''
    }
  })

  const selectedType = watch('type')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField label="Tipo" select {...register('type')} defaultValue={movement.type}>
          {MOVEMENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {resolveMovementTypeLabel(type)}
            </MenuItem>
          ))}
        </TextField>
        <MovementFormFields register={register} errors={errors} type={selectedType} />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </Stack>
    </Box>
  )
}
