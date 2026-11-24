import { Alert, Stack, Typography } from '@mui/material'
import { LeafButton } from '@/components/shared/LeafButton'
import { useT } from '@/i18n'
import type { StatusMessageCardProps } from '../typings/props'

/** Mensaje de estado dentro de `AuthPageLayout` (error de configuración, sin conexión...). */
export function StatusMessageCard({
  title,
  description,
  severity,
  actionLabel,
  onAction,
  isActionLoading = false
}: StatusMessageCardProps): React.JSX.Element {
  const t = useT()

  return (
    <Stack component="section" spacing={2.5} aria-labelledby="status-message-title">
      <Typography id="status-message-title" variant="h6" component="h2">
        {title}
      </Typography>
      <Alert severity={severity}>{description}</Alert>
      {actionLabel && onAction && (
        <LeafButton
          size="large"
          fullWidth
          onClick={onAction}
          disabled={isActionLoading}
          aria-busy={isActionLoading}
        >
          {isActionLoading ? t('common.loading') : actionLabel}
        </LeafButton>
      )}
    </Stack>
  )
}
