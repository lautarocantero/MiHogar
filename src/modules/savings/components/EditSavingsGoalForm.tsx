import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addSavingsGoalFormSchema } from '@/validation/addSavingsGoalFormSchema'
import { SavingsGoalFormFields } from './SavingsGoalFormFields'
import type { EditSavingsGoalFormProps } from '../typings/props'
import type { AddSavingsGoalFormValues } from '../typings/types'

export function EditSavingsGoalForm({
  goal,
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: EditSavingsGoalFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddSavingsGoalFormValues>({
    resolver: zodResolver(addSavingsGoalFormSchema),
    defaultValues: {
      name: goal.name,
      icon: goal.icon,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate ?? '',
      ownerType: goal.ownerType,
      ownerId: goal.ownerId ?? ''
    }
  })

  const selectedOwnerType = watch('ownerType')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <SavingsGoalFormFields
          register={register}
          control={control}
          errors={errors}
          selectedOwnerType={selectedOwnerType}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
