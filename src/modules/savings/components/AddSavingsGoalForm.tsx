import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addSavingsGoalFormSchema } from '@/validation/addSavingsGoalFormSchema'
import { OwnerType } from '@/typings/domain/enums'
import { SavingsGoalFormFields } from './SavingsGoalFormFields'
import type { AddSavingsGoalFormProps } from '../typings/props'
import type { AddSavingsGoalFormValues } from '../typings/types'

export function AddSavingsGoalForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: AddSavingsGoalFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddSavingsGoalFormValues>({
    resolver: zodResolver(addSavingsGoalFormSchema),
    defaultValues: {
      name: '',
      icon: 'flag',
      targetAmount: undefined,
      currentAmount: undefined,
      targetDate: '',
      ownerType: OwnerType.HOUSEHOLD,
      ownerId: ''
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
            {isSubmitting ? 'Guardando…' : 'Agregar meta'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
