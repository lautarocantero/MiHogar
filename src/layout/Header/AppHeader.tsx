import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { organicColors } from '@/theme/tokens'
import { NotificationsBell } from '@/components/shared/NotificationsBell'
import { useTodayLabel } from './useTodayLabel'
import { useScreenTitle } from './useScreenTitle'
import type { AppHeaderProps } from './typings/props'

export function AppHeader({ onOpenQuickAdd }: AppHeaderProps): React.JSX.Element {
  const todayLabel = useTodayLabel()
  const { title, parentPath } = useScreenTitle()
  const navigate = useNavigate()

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
        {parentPath && (
          <IconButton
            aria-label="Volver"
            onClick={() => navigate(parentPath)}
            sx={{ color: organicColors.orange.dark }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box flexGrow={1}>
          <Typography variant="body2" color="text.secondary">
            {todayLabel}
          </Typography>
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
        </Box>
        <NotificationsBell />
        <Button
          variant="contained"
          size="large"
          startIcon={<AttachMoneyIcon />}
          onClick={onOpenQuickAdd}
        >
          Anotar movimiento
        </Button>
      </Toolbar>
    </AppBar>
  )
}
