import { Skeleton, Stack } from '@mui/material'

export function PageSkeleton(): React.JSX.Element {
  return (
    <Stack spacing={3} p={4} aria-busy="true" aria-label="Cargando la pantalla">
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={100} />
      <Skeleton variant="rounded" height={100} />
    </Stack>
  )
}
