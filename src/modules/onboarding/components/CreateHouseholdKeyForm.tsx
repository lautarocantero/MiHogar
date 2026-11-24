import { Alert, Box, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createHouseholdKeyFormSchema } from '@/validation/createHouseholdKeyFormSchema'
import { PasswordField } from '@/components/shared/PasswordField'
import { LeafButton } from '@/components/shared/LeafButton'
import { FormSectionHeader } from '@/components/shared/FormSectionHeader'
import { useT } from '@/i18n'
import type { CreateHouseholdKeyFormProps } from '../typings/props'
import type { CreateHouseholdKeyFormValues } from '../typings/types'

export function CreateHouseholdKeyForm({
  onSubmit,
  isSubmitting,
  errorMessage
}: CreateHouseholdKeyFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateHouseholdKeyFormValues>({
    resolver: zodResolver(createHouseholdKeyFormSchema),
    defaultValues: { householdKey: '', confirmHouseholdKey: '' }
  })
  const { ref: householdKeyRef, ...householdKeyField } = register('householdKey')
  const { ref: confirmRef, ...confirmField } = register('confirmHouseholdKey')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="create-household-key-title"
    >
      <Stack spacing={2.5}>
        <Typography id="create-household-key-title" variant="h6" component="h2">
          {t('onboarding.createKey.title')}
        </Typography>
        <FormSectionHeader
          step={2}
          title={t('onboarding.createKey.stepTitle')}
          subtitle={t('onboarding.createKey.stepSubtitle')}
        />
        <Typography variant="body2" color="text.secondary">
          {t('onboarding.createKey.description')}
        </Typography>
        <PasswordField
          label={t('onboarding.householdKeyLabel')}
          autoComplete="new-password"
          fullWidth
          inputRef={householdKeyRef}
          {...householdKeyField}
          error={Boolean(errors.householdKey)}
          helperText={errors.householdKey ? t('onboarding.validation.householdKeyTooShort') : ' '}
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        <PasswordField
          label={t('onboarding.confirmHouseholdKeyLabel')}
          autoComplete="new-password"
          fullWidth
          inputRef={confirmRef}
          {...confirmField}
          error={Boolean(errors.confirmHouseholdKey)}
          helperText={
            errors.confirmHouseholdKey ? t('onboarding.validation.householdKeysDontMatch') : ' '
          }
          slotProps={{ htmlInput: { 'aria-required': true } }}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <LeafButton
          type="submit"
          size="large"
          fullWidth
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t('onboarding.createKey.submitting') : t('onboarding.createKey.submit')}
        </LeafButton>
      </Stack>
    </Box>
  )
}
