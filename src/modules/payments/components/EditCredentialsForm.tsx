import { Alert, Box, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editCredentialsFormSchema } from '@/validation/editCredentialsFormSchema'
import type { EditCredentialsFormProps } from '../typings/props'
import type { EditCredentialsFormValues } from '../typings/types'
import { useT } from '@/i18n'

export function EditCredentialsForm({
  payment,
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage
}: EditCredentialsFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditCredentialsFormValues>({
    resolver: zodResolver(editCredentialsFormSchema),
    defaultValues: {
      username: payment.credentials?.username ?? '',
      password: payment.credentials?.password ?? '',
      clientNumber: payment.credentials?.clientNumber ?? '',
      providerUrl: payment.providerUrl ?? ''
    }
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <TextField label={t('payments.credentials.username')} {...register('username')} />
        <TextField label={t('payments.credentials.password')} {...register('password')} />
        <TextField label={t('payments.credentials.clientNumber')} {...register('clientNumber')} />
        <TextField
          label={t('payments.credentials.providerUrl')}
          placeholder="https://www.edesur.com.ar"
          {...register('providerUrl')}
          error={Boolean(errors.providerUrl)}
          helperText={errors.providerUrl?.message && t(errors.providerUrl.message)}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large" onClick={onCancel} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('payments.credentials.save')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
