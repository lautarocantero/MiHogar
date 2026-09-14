import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addMemberFormSchema } from '@/validation/addMemberFormSchema'
import type { AddMemberFormProps } from '../typings/props'
import type { AddMemberFormValues } from '../typings/types'

export function AddMemberForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: AddMemberFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddMemberFormValues>({
    resolver: yupResolver(addMemberFormSchema),
    defaultValues: { name: '' }
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Nombre"
          autoFocus
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Agregar'}
        </Button>
      </Stack>
    </Box>
  )
}
