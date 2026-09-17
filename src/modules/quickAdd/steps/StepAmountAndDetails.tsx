import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quickAddFormSchema } from '@/validation/quickAddFormSchema'
import { MovementFormFields } from '@/modules/timeline/components/MovementFormFields'
import type { StepAmountAndDetailsProps } from '../typings/props'
import type { QuickAddFormValues } from '../typings/types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

export function StepAmountAndDetails({
  type,
  onSubmit,
  onBack,
  isSubmitting,
  errorMessage
}: StepAmountAndDetailsProps): React.JSX.Element {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<QuickAddFormValues>({
    resolver: zodResolver(quickAddFormSchema),
    defaultValues: {
      type,
      amount: undefined,
      date: TODAY_ISO,
      categoryId: '',
      accountId: '',
      toAccountId: ''
    }
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <MovementFormFields register={register} control={control} errors={errors} type={type} />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onBack} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar el movimiento'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
