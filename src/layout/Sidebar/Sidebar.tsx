import { useState } from 'react'
import { Box, Drawer, IconButton, List, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { sidebarColors, organicTypography } from '@/theme/tokens'
import { DemoModeExitButton } from '@/components/shared/DemoModeExitButton'
import { LogoutButton } from '@/components/shared/LogoutButton'
import { ReloadAppButton } from './ReloadAppButton'
import twigPattern from '@/assets/images/twig-pattern.png'
import logo from '@/assets/images/mi-hogar-logo.png'
import { SidebarItem } from './SidebarItem'
import { useSidebarItems } from './useSidebarItems'

const SIDEBAR_WIDTH = 290
const SIDEBAR_WIDTH_COLLAPSED = 88
const SETTINGS_ITEM = { label: 'Configuración', path: ROUTES.SETTINGS, icon: SettingsIcon }

export function Sidebar(): React.JSX.Element {
  const items = useSidebarItems()
  const [collapsed, setCollapsed] = useState(false)

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
  const expandOnNavigate = (): void => setCollapsed(false)
  const toggleLabel = collapsed ? 'Mostrar panel' : 'Ocultar panel'

  return (
    <Drawer
      variant="permanent"
      component="nav"
      aria-label="Navegación principal"
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        transition: (theme) => theme.transitions.create('width'),
        '& .MuiDrawer-paper': {
          position: 'relative',
          width,
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
          border: 'none',
          background: sidebarColors.gradient,
          transition: (theme) => theme.transitions.create('width')
        }
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${twigPattern})`,
          backgroundSize: 560,
          backgroundRepeat: 'repeat',
          filter: 'invert(1) grayscale(1) contrast(0.9)',
          mixBlendMode: 'screen',
          opacity: sidebarColors.patternOpacity,
          pointerEvents: 'none'
        }}
      />

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'flex-start',
          gap: 1.25,
          pt: 1.75,
          px: collapsed ? 1.25 : 2,
          pb: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 1 : 1.75
          }}
        >
          <IconButton
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={() => setCollapsed((prev) => !prev)}
            sx={{
              width: 34,
              height: 34,
              borderRadius: 0,
              backgroundColor: 'rgba(255,253,249,0.08)',
              border: '1px solid rgba(255,253,249,0.18)',
              color: 'rgba(255,253,249,0.75)',
              '&:hover': { backgroundColor: 'rgba(255,253,249,0.18)', color: sidebarColors.onDark }
            }}
          >
            {collapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
          </IconButton>
        </Box>

        <Box
          component={NavLink}
          to={ROUTES.HOME}
          title="Mi Hogar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
            minHeight: 48,
            gap: collapsed ? 0 : 1.75,
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 1 : 1.75,
            textDecoration: 'none',
            '&:hover': { backgroundColor: 'rgba(255,253,249,0.10)' }
          }}
        >
          <Box
            component="img"
            src={logo}
            alt=""
            sx={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          {!collapsed && (
            <Typography
              sx={{
                fontFamily: organicTypography.bodyFontFamily,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: sidebarColors.onDark,
                letterSpacing: '0.2px',
                whiteSpace: 'nowrap'
              }}
            >
              Mi Hogar
            </Typography>
          )}
        </Box>
      </Box>

      <List
        component="div"
        sx={{
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          px: 1
        }}
      >
        {items.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            onNavigate={collapsed ? expandOnNavigate : undefined}
          />
        ))}
      </List>

      <Box sx={{ position: 'relative', px: collapsed ? 1.25 : 2, pb: 2.25, pt: 1.5 }}>
        {!collapsed && (
          <Typography
            sx={{
              fontSize: '0.6875rem',
              color: 'rgba(255,253,249,0.35)',
              textAlign: 'center',
              mb: 1,
              mx: 0.5
            }}
          >
            v{__APP_VERSION__}
          </Typography>
        )}
        <Box sx={{ height: '1px', backgroundColor: 'rgba(255,253,249,0.22)', mb: 1.75, mx: 0.5 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DemoModeExitButton collapsed={collapsed} />
          <ReloadAppButton collapsed={collapsed} />
          <SidebarItem
            item={SETTINGS_ITEM}
            collapsed={collapsed}
            onNavigate={collapsed ? expandOnNavigate : undefined}
          />
          <LogoutButton collapsed={collapsed} />
        </Box>
      </Box>
    </Drawer>
  )
}
