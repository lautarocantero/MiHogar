import { Box, Typography } from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction'
import { organicColors } from '@/theme/tokens'
import type { PlaceholderPageProps } from './typings/props'

export function PlaceholderPage({ title }: PlaceholderPageProps): React.JSX.Element {
  return (
    <Box
      component="section"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py={10}
      gap={2}
    >
      <ConstructionIcon
        sx={{ fontSize: 56, color: organicColors.orange.main }}
        aria-hidden="true"
      />
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={420}>
        Esta pantalla todavía se está construyendo. Pronto vas a poder verla acá.
      </Typography>
    </Box>
  )
}
