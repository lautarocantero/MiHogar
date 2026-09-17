import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addCategoryFormSchema } from '@/validation/addCategoryFormSchema'
import type { AddCategoryFormProps } from '../typings/props'
import type { AddCategoryFormValues } from '../typings/types'

export function AddCategoryForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: AddCategoryFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategoryFormSchema),
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
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Agregar'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
