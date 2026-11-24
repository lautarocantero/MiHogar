import { Box, Skeleton } from '@mui/material'
import { useT } from '@/i18n'

export function VaultCheckingSkeleton(): React.JSX.Element {
  const t = useT()

  return (
    <Box
      component="main"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100dvh"
      bgcolor="background.default"
      p={2}
      aria-busy="true"
      aria-label={t('common.loading')}
    >
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        <Skeleton variant="rounded" height={40} width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={48} />
      </Box>
    </Box>
  )
}
