import { Box, Skeleton } from '@mui/material'

export function VaultCheckingSkeleton(): React.JSX.Element {
  return (
    <Box
      component="main"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={2}
      aria-busy="true"
      aria-label="Cargando"
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
