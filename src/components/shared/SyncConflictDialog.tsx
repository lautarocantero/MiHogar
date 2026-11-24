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
import { useSyncConflictResolution } from '@/hooks/shared/useSyncConflictResolution'
import { useT } from '@/i18n'
import { LeafButton } from './LeafButton'

/**
 * "Otro dispositivo guardó cambios". No se cierra con Escape ni tocando afuera: hay que
 * elegir una versión (los cambios locales no se tiran sin que el usuario lo decida).
 */
export function SyncConflictDialog(): React.JSX.Element {
  const t = useT()
  const titleId = useId()
  const descriptionId = useId()
  const { isOpen, keepLocal, applyRemote, exportLocal, isWorking, errorMessage, message } =
    useSyncConflictResolution()

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>{t('sync.conflict.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText id={descriptionId} variant="body2">
            {t('sync.conflict.description')}
          </DialogContentText>
          <Button
            variant="text"
            startIcon={<DownloadIcon />}
            onClick={exportLocal}
            disabled={isWorking}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('sync.conflict.exportLocal')}
          </Button>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Stack role="status" aria-live="polite">
            {message && <Alert severity="success">{message}</Alert>}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={applyRemote}
          disabled={isWorking}
          sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
        >
          {t('sync.conflict.useRemote')}
        </Button>
        <LeafButton
          onClick={keepLocal}
          disabled={isWorking}
          aria-busy={isWorking}
          sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, ml: '0 !important' }}
        >
          {t('sync.conflict.keepLocal')}
        </LeafButton>
      </DialogActions>
    </Dialog>
  )
}
