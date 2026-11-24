import { useId } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { usePendingExitResolution } from '@/hooks/shared/usePendingExitResolution'
import { PendingExitReason } from '@/store/ui/typings/enums'
import { useT } from '@/i18n'
import { LeafButton } from './LeafButton'

const DESCRIPTION_KEY: Record<PendingExitReason, string> = {
  [PendingExitReason.SIGN_OUT]: 'sync.unsaved.description',
  [PendingExitReason.LOCK]: 'sync.unsaved.description',
  [PendingExitReason.SESSION_ENDED]: 'sync.unsaved.sessionEndedDescription',
  [PendingExitReason.KEY_CHANGED]: 'sync.unsaved.keyChangedDescription'
}

/**
 * "Tenés cambios sin guardar": aparece cuando una salida (cerrar sesión, bloquear, sesión
 * vencida, clave cambiada en otro dispositivo) perdería cambios que no llegaron a la nube.
 * No se cierra con Escape ni tocando afuera: hay que elegir qué hacer.
 */
export function UnsavedChangesDialog(): React.JSX.Element {
  const t = useT()
  const titleId = useId()
  const descriptionId = useId()
  const {
    pendingExit,
    canRetry,
    retry,
    discard,
    exportBackup,
    isWorking,
    errorMessage,
    message
  } = usePendingExitResolution()

  const fullWidthOnMobile = { flex: { xs: '1 1 100%', sm: '0 0 auto' }, ml: '0 !important' }

  return (
    <Dialog
      open={pendingExit !== null}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>{t('sync.unsaved.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText id={descriptionId} variant="body2">
            {pendingExit ? t(DESCRIPTION_KEY[pendingExit]) : null}
          </DialogContentText>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Stack role="status" aria-live="polite">
            {message && <Alert severity="success">{message}</Alert>}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button color="error" onClick={discard} disabled={isWorking} sx={fullWidthOnMobile}>
          {t('sync.unsaved.discard')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportBackup}
          disabled={isWorking}
          sx={fullWidthOnMobile}
        >
          {t('sync.unsaved.export')}
        </Button>
        {canRetry && (
          <LeafButton
            onClick={retry}
            disabled={isWorking}
            aria-busy={isWorking}
            sx={fullWidthOnMobile}
          >
            {t('sync.unsaved.retry')}
          </LeafButton>
        )}
      </DialogActions>
    </Dialog>
  )
}
