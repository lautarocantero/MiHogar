import { Skeleton, Stack } from '@mui/material'
import { useT } from '@/i18n'

type PageSkeletonProps = {
  /** Dentro del `main` del layout el padding ya lo pone el contenedor. */
  disablePadding?: boolean
}

export function PageSkeleton({ disablePadding = false }: PageSkeletonProps): React.JSX.Element {
  const t = useT()
  return (
    <Stack
      spacing={3}
      p={disablePadding ? 0 : { xs: 2, sm: 3, md: 4 }}
      aria-busy="true"
      aria-label={t('layout.loadingScreen')}
    >
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={100} />
      <Skeleton variant="rounded" height={100} />
    </Stack>
  )
}
