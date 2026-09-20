import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { headerColors, organicColors, organicTypography } from '@/theme/tokens'
import { NotificationsBell } from '@/components/shared/NotificationsBell'
import twigPattern from '@/assets/images/twig-pattern.png'
import movementLogo from '@/assets/images/movement_logo.png'
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
        position: 'relative',
        overflow: 'hidden',
        background: headerColors.gradient,
        color: organicColors.orange.dark,
        borderBottom: `1px solid ${organicColors.neutral.border}`
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${twigPattern})`,
          backgroundSize: 360,
          backgroundRepeat: 'repeat',
          filter: 'grayscale(1) sepia(1) saturate(2.4) hue-rotate(340deg) brightness(1.05)',
          mixBlendMode: 'multiply',
          opacity: headerColors.patternOpacity,
          pointerEvents: 'none'
        }}
      />
      <Toolbar sx={{ gap: 2, position: 'relative' }}>
        {parentPath && (
          <IconButton
            aria-label="Volver"
            onClick={() => navigate(parentPath)}
            sx={{ color: organicColors.orange.dark }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box flexGrow={1} minWidth={0}>
          <Typography variant="body2" color="text.secondary">
            {todayLabel}
          </Typography>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontFamily: organicTypography.titleFontFamily, color: organicColors.orange.dark }}
          >
            {title}
          </Typography>
        </Box>
        <NotificationsBell />
        <Box
          aria-hidden="true"
          sx={{ width: '1px', height: 34, backgroundColor: organicColors.neutral.border }}
        />
        <IconButton
          aria-label="Nuevo movimiento"
          title="Nuevo movimiento"
          onClick={onOpenQuickAdd}
          sx={{
            width: 46,
            height: 46,
            p: 0,
            overflow: 'hidden',
            '&:hover': { filter: 'brightness(1.08)' }
          }}
        >
          <Box
            component="img"
            src={movementLogo}
            alt="Nuevo movimiento"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              display: 'block'
            }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
