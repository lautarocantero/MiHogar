import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate } from 'react-router-dom'
import { headerColors, organicColors, organicLayout, organicTypography } from '@/theme/tokens'
import { useT } from '@/i18n'
import { NotificationsBell } from '@/components/shared/NotificationsBell'
import { SyncStatusIndicator } from '@/components/shared/SyncStatusIndicator'
import { useResponsive } from '@/hooks/shared/useResponsive'
import twigPattern from '@/assets/images/twig-pattern.png'
import movementLogo from '@/assets/images/movement_logo.png'
import { useTodayLabel } from './useTodayLabel'
import { useScreenTitle } from './useScreenTitle'
import type { AppHeaderProps } from './typings/props'

export function AppHeader({ onOpenQuickAdd, navigation }: AppHeaderProps): React.JSX.Element {
  const t = useT()
  const todayLabel = useTodayLabel()
  const { title, parentPath } = useScreenTitle()
  const navigate = useNavigate()
  const { isPhone } = useResponsive()

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
        borderBottom: `1px solid ${organicColors.neutral.border}`,
        paddingTop: organicLayout.safeArea.top,
        paddingRight: organicLayout.safeArea.right
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
      <Toolbar sx={{ gap: { xs: 0.5, sm: 2 }, position: 'relative', px: { xs: 1, sm: 3 } }}>
        {navigation && (
          <IconButton
            aria-label={t('layout.openMenu')}
            aria-controls={navigation.controlsId}
            aria-expanded={navigation.isOpen}
            aria-haspopup="true"
            onClick={navigation.onOpen}
            sx={{ color: organicColors.orange.dark }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {parentPath && (
          <IconButton
            aria-label={t('layout.back')}
            onClick={() => navigate(parentPath)}
            sx={{ color: organicColors.orange.dark }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box flexGrow={1} minWidth={0}>
          {/* La fecha es secundaria: en teléfonos se oculta para dejarle lugar al título. */}
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {todayLabel}
          </Typography>
          <Typography
            variant="h5"
            component="h1"
            noWrap
            title={title}
            sx={(theme) => ({
              fontFamily: organicTypography.titleFontFamily,
              color: organicColors.orange.dark,
              [theme.breakpoints.down('sm')]: { fontSize: '1.125rem' }
            })}
          >
            {title}
          </Typography>
        </Box>
        <SyncStatusIndicator compact={isPhone} />
        <NotificationsBell />
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: '1px',
            height: 34,
            flexShrink: 0,
            backgroundColor: organicColors.neutral.border
          }}
        />
        <IconButton
          aria-label={t('layout.newMovement')}
          title={t('layout.newMovement')}
          onClick={onOpenQuickAdd}
          sx={{
            width: 46,
            height: 46,
            p: 0,
            flexShrink: 0,
            overflow: 'hidden',
            '&:hover': { filter: 'brightness(1.08)' }
          }}
        >
          <Box
            component="img"
            src={movementLogo}
            alt=""
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
