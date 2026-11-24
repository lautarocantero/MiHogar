import { Alert, Button, Divider, Stack, Typography } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import { HouseholdKeyPromptDialog } from '@/components/shared/HouseholdKeyPromptDialog'
import { useRestoreVaultBackup } from '@/hooks/shared/useRestoreVaultBackup'
import { useT } from '@/i18n'

/** Primer uso: en vez de crear una clave nueva, traer un respaldo `.dat` existente. */
export function RestoreBackupSection(): React.JSX.Element {
  const t = useT()
  const {
    pickBackup,
    isAwaitingKey,
    submitKey,
    cancel,
    isRestoring,
    errorMessage,
    pickErrorMessage
  } = useRestoreVaultBackup({ replace: false })

  return (
    <Stack component="section" spacing={2} mt={3} aria-labelledby="restore-backup-title">
      <Divider />
      <Typography id="restore-backup-title" variant="subtitle1" component="h2" fontWeight={600}>
        {t('onboarding.restore.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('onboarding.restore.description')}
      </Typography>
      {pickErrorMessage && <Alert severity="error">{pickErrorMessage}</Alert>}
      <Button variant="outlined" startIcon={<UploadIcon />} onClick={pickBackup} fullWidth>
        {t('onboarding.restore.pick')}
      </Button>
      <HouseholdKeyPromptDialog
        open={isAwaitingKey}
        title={t('onboarding.restore.dialogTitle')}
        description={t('onboarding.restore.dialogDescription')}
        submitLabel={t('onboarding.restore.submit')}
        isSubmitting={isRestoring}
        errorMessage={errorMessage}
        onSubmit={submitKey}
        onClose={cancel}
      />
    </Stack>
  )
}
