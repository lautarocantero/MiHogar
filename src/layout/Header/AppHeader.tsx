import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { organicColors } from '@/theme/tokens'
import { useTodayLabel } from './useTodayLabel'
import { useScreenTitle } from './useScreenTitle'
import type { AppHeaderProps } from './typings/props'

export function AppHeader({ onOpenQuickAdd }: AppHeaderProps): React.JSX.Element {
  const todayLabel = useTodayLabel()
  const screenTitle = useScreenTitle()

  return (
    <AppBar
      position="sticky"
      component="header"
      elevation={0}
      sx={{
        backgroundColor: organicColors.background,
        color: organicColors.orange.dark,
        borderBottom: `1px solid ${organicColors.neutral.border}`
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            {todayLabel}
          </Typography>
          <Typography variant="h5" component="h1">
            {screenTitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddCircleIcon />}
          onClick={onOpenQuickAdd}
        >
          Anotar movimiento
        </Button>
      </Toolbar>
    </AppBar>
  )
}
