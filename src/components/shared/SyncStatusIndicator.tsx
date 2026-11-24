import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material'
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined'
import { useAppSelector } from '@/store/hooks'
import { selectSaveStatus } from '@/store/ui/uiSelectors'
import { selectVaultStatus } from '@/store/vault/vaultSelectors'
import { SaveStatus } from '@/store/ui/typings/enums'
import { VaultStatus } from '@/store/vault/typings/enums'
import { retryPendingVaultSave } from '@/store/middleware/persistenceMiddleware'
import { useOnlineStatus } from '@/hooks/shared/useOnlineStatus'
import { useT } from '@/i18n'

type SyncStatusIndicatorProps = {
  /** Solo el ícono (el texto queda para lectores de pantalla y en un tooltip). */
  compact?: boolean
}

type SyncState = 'pending' | 'saving' | 'saved' | 'offline' | 'error' | 'conflict'

function resolveSyncState(saveStatus: SaveStatus, isOnline: boolean): SyncState {
  if (saveStatus === SaveStatus.CONFLICT) return 'conflict'
  if (saveStatus === SaveStatus.ERROR) return 'error'
  if (saveStatus === SaveStatus.OFFLINE || !isOnline) return 'offline'
  // "Sin guardar" mientras espera el debounce: si se cierra la pestaña en este momento
  // se nota que el cambio todavía no subió.
  if (saveStatus === SaveStatus.PENDING) return 'pending'
  if (saveStatus === SaveStatus.SAVING) return 'saving'
  return 'saved'
}

const ICON_SIZE = 18

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px'
} as const

/**
 * Estado de la sincronización con la nube: sin guardar / guardando / guardado / sin
 * conexión / error / conflicto.
 * Se anuncia con `aria-live="polite"`. No se muestra fuera del vault desbloqueado (en la
 * demo no se guarda nada).
 */
export function SyncStatusIndicator({
  compact = false
}: SyncStatusIndicatorProps): React.JSX.Element | null {
  const saveStatus = useAppSelector(selectSaveStatus)
  const vaultStatus = useAppSelector(selectVaultStatus)
  const isOnline = useOnlineStatus()
  const t = useT()

  if (vaultStatus !== VaultStatus.UNLOCKED) {
    return null
  }

  const state = resolveSyncState(saveStatus, isOnline)
  const label = t(`sync.status.${state}`)
  const color =
    state === 'error' || state === 'conflict'
      ? 'error.main'
      : state === 'offline' || state === 'pending'
        ? 'warning.dark'
        : 'text.secondary'

  const icon =
    state === 'saving' ? (
      <CircularProgress size={ICON_SIZE - 4} thickness={5} color="inherit" aria-hidden />
    ) : state === 'saved' ? (
      <CloudDoneOutlinedIcon sx={{ fontSize: ICON_SIZE }} aria-hidden />
    ) : state === 'offline' ? (
      <CloudOffOutlinedIcon sx={{ fontSize: ICON_SIZE }} aria-hidden />
    ) : state === 'pending' ? (
      <EditNoteOutlinedIcon sx={{ fontSize: ICON_SIZE }} aria-hidden />
    ) : state === 'conflict' ? (
      <SyncProblemOutlinedIcon sx={{ fontSize: ICON_SIZE }} aria-hidden />
    ) : (
      <ErrorOutlineIcon sx={{ fontSize: ICON_SIZE }} aria-hidden />
    )

  const content = (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={0.75}
      minHeight={32}
      minWidth={compact ? 32 : undefined}
      justifyContent={compact ? 'center' : 'flex-start'}
      sx={{ color }}
    >
      <Box display="inline-flex" width={ICON_SIZE} justifyContent="center" flexShrink={0}>
        {icon}
      </Box>
      <Typography
        variant="caption"
        component="span"
        sx={compact ? visuallyHidden : { whiteSpace: 'nowrap', fontWeight: 600 }}
      >
        {label}
      </Typography>
    </Box>
  )

  return (
    <Box display="inline-flex" alignItems="center" gap={0.5} flexShrink={0}>
      <Box role="status" aria-live="polite" aria-atomic="true" display="inline-flex">
        {compact ? (
          <Tooltip title={label} describeChild>
            <Box display="inline-flex" tabIndex={0}>
              {content}
            </Box>
          </Tooltip>
        ) : (
          content
        )}
      </Box>
      {state === 'error' && (
        <Button size="small" color="error" onClick={retryPendingVaultSave} sx={{ minWidth: 0 }}>
          {t('common.retry')}
        </Button>
      )}
    </Box>
  )
}
