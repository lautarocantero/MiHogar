import {
  Alert,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  Typography
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { DialogHeader } from '@/components/shared/DialogHeader'
import { HouseholdKeyPromptDialog } from '@/components/shared/HouseholdKeyPromptDialog'
import { useT } from '@/i18n'
import { useExportImportVault } from '../useExportImportVault'

export function ExportImportButtons(): React.JSX.Element {
  const t = useT()
  const {
    exportBackup,
    requestImport,
    confirmImport,
    cancelImport,
    isConfirmingImport,
    restore,
    isLoading,
    errorMessage,
    message
  } = useExportImportVault()

  return (
    <Card
      sx={{ p: { xs: 2, sm: 3 } }}
      elevation={0}
      component="section"
      aria-labelledby="backup-title"
    >
      <Stack spacing={2}>
        <Typography id="backup-title" variant="h6" component="h2">
          {t('settingsCloud.backup.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('settingsCloud.backup.description')}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportBackup}
            disabled={isLoading || restore.isRestoring}
            aria-busy={isLoading}
          >
            {t('settingsCloud.backup.export')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={requestImport}
            disabled={isLoading || restore.isRestoring}
          >
            {t('settingsCloud.backup.import')}
          </Button>
        </Stack>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Stack role="status" aria-live="polite">
          {message && <Alert severity="success">{message}</Alert>}
        </Stack>
      </Stack>

      <Dialog
        open={isConfirmingImport}
        onClose={cancelImport}
        fullWidth
        maxWidth="xs"
        aria-labelledby="confirm-import-title"
        aria-describedby="confirm-import-description"
      >
        <DialogHeader id="confirm-import-title" onClose={cancelImport}>
          {t('settingsCloud.backup.confirmTitle')}
        </DialogHeader>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity="warning">{t('settingsCloud.backup.confirmWarning')}</Alert>
            <DialogContentText id="confirm-import-description" variant="body2">
              {t('settingsCloud.backup.confirmDescription')}
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={cancelImport}>{t('common.cancel')}</Button>
          <Button color="error" variant="contained" onClick={confirmImport}>
            {t('settingsCloud.backup.confirmSubmit')}
          </Button>
        </DialogActions>
      </Dialog>

      <HouseholdKeyPromptDialog
        open={restore.isAwaitingKey}
        title={t('onboarding.restore.dialogTitle')}
        description={t('settingsCloud.backup.keyPromptDescription')}
        submitLabel={t('settingsCloud.backup.replaceSubmit')}
        isSubmitting={restore.isRestoring}
        errorMessage={restore.errorMessage}
        onSubmit={restore.submitKey}
        onClose={restore.cancel}
      />
    </Card>
  )
}
