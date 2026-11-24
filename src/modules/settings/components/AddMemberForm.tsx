import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addMemberFormSchema } from '@/validation/addMemberFormSchema'
import { useT } from '@/i18n'
import type { AddMemberFormProps } from '../typings/props'
import type { AddMemberFormValues } from '../typings/types'

export function AddMemberForm({
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: AddMemberFormProps): React.JSX.Element {
  const t = useT()
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
          label={t('settings.members.nameLabel')}
          autoFocus
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message && t(errors.name.message)}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('common.add')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
