import { Alert, Box, Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addAccountFormSchema } from '@/validation/addAccountFormSchema'
import { AccountFormFields } from './AccountFormFields'
import type { EditAccountFormProps } from '../typings/props'
import type { AddAccountFormValues } from '../typings/types'

export function EditAccountForm({
  account,
  onSubmit,
  isSubmitting,
  errorMessage
}: EditAccountFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountFormSchema),
    defaultValues: {
      name: account.name,
      type: account.type,
      ownerType: account.ownerType,
      ownerId: account.ownerId ?? '',
      balance: account.balance,
      contextPhrase: account.contextPhrase ?? '',
      closingDay: account.closingDay,
      dueDay: account.dueDay,
      installmentsRemaining: account.installmentsRemaining
    }
  })

  const selectedType = watch('type')
  const selectedOwnerType = watch('ownerType')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <AccountFormFields
          register={register}
          control={control}
          errors={errors}
          selectedType={selectedType}
          selectedOwnerType={selectedOwnerType}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </Stack>
    </Box>
  )
}
