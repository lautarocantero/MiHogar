import { Alert, Box, Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unlockFormSchema } from '@/validation/unlockFormSchema'
import { PasswordField } from '@/components/shared/PasswordField'
import { LeafButton } from '@/components/shared/LeafButton'
import { useT } from '@/i18n'
import type { UnlockFormProps } from '../typings/props'
import type { UnlockFormValues } from '../typings/types'

export function UnlockForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  noticeMessage
}: UnlockFormProps): React.JSX.Element {
  const t = useT()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UnlockFormValues>({
    resolver: zodResolver(unlockFormSchema),
    defaultValues: { householdKey: '' }
  })
  const { ref: householdKeyRef, ...householdKeyField } = register('householdKey')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="unlock-title"
    >
      <Stack spacing={2.5}>
        <Typography id="unlock-title" variant="h6" component="h2">
          {t('onboarding.unlock.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('onboarding.unlock.description')}
        </Typography>
        {noticeMessage && <Alert severity="info">{noticeMessage}</Alert>}
        <PasswordField
          label={t('onboarding.householdKeyLabel')}
          autoComplete="current-password"
          autoFocus
          fullWidth
          inputRef={householdKeyRef}
          {...householdKeyField}
          error={Boolean(errors.householdKey)}
          helperText={errors.householdKey ? t('onboarding.validation.householdKeyRequired') : ' '}
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
          {isSubmitting ? t('onboarding.unlock.submitting') : t('onboarding.unlock.submit')}
        </LeafButton>
      </Stack>
    </Box>
  )
}
