import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changeHouseholdKeyFormSchema } from '@/validation/changeHouseholdKeyFormSchema'
import { PasswordField } from '@/components/shared/PasswordField'
import { useT } from '@/i18n'
import type { HouseholdKeyFormProps } from '../typings/props'
import type { ChangeHouseholdKeyFormValues } from '../typings/types'

export function HouseholdKeyForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  successMessage
}: HouseholdKeyFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ChangeHouseholdKeyFormValues>({
    resolver: yupResolver(changeHouseholdKeyFormSchema),
    defaultValues: { currentKey: '', newKey: '', confirmNewKey: '' }
  })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        reset()
      })}
      noValidate
    >
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {t('settings.householdKey.description')}
        </Typography>
        <PasswordField
          label={t('settings.householdKey.current')}
          {...register('currentKey')}
          error={Boolean(errors.currentKey)}
          helperText={errors.currentKey?.message && t(errors.currentKey.message)}
        />
        <PasswordField
          label={t('settings.householdKey.new')}
          {...register('newKey')}
          error={Boolean(errors.newKey)}
          helperText={errors.newKey?.message && t(errors.newKey.message)}
        />
        <PasswordField
          label={t('settings.householdKey.confirm')}
          {...register('confirmNewKey')}
          error={Boolean(errors.confirmNewKey)}
          helperText={errors.confirmNewKey?.message && t(errors.confirmNewKey.message)}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('settings.householdKey.submit')}
        </Button>
      </Stack>
    </Box>
  )
}
