import { useState } from 'react'
import { Box, Drawer, IconButton, List, ListItem, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { sidebarColors, organicLayout, organicTypography } from '@/theme/tokens'
import { useT } from '@/i18n'
import { useAppSelector } from '@/store/hooks'
import { selectIsDemoMode } from '@/store/vault/vaultSelectors'
import { DemoModeExitButton } from '@/components/shared/DemoModeExitButton'
import { LogoutButton } from '@/components/shared/LogoutButton'
import { ReloadAppButton } from './ReloadAppButton'
import { LanguageSidebarButton } from './LanguageSidebarButton'
import twigPattern from '@/assets/images/twig-pattern.png'
import logo from '@/assets/images/gastito-logo.png'
import { SidebarItem } from './SidebarItem'
import { useSidebarItems } from './useSidebarItems'
import type { SidebarProps } from './typings/props'


export function Sidebar({
  id,
  isMobile,
  mobileOpen,
  onMobileClose
}: SidebarProps): React.JSX.Element {
  const t = useT()
  const items = useSidebarItems()
  const settingsItem = { label: t('nav.settings'), path: ROUTES.SETTINGS, icon: SettingsIcon }
  const isDemoMode = useAppSelector(selectIsDemoMode)
  const [collapsedPreference, setCollapsed] = useState(false)

  // En mobile el drawer siempre se muestra completo: colapsarlo no tiene sentido ahí.
  const collapsed = !isMobile && collapsedPreference
  const width = collapsed ? organicLayout.sidebarWidthCollapsed : organicLayout.sidebarWidth
  const expandOnNavigate = (): void => setCollapsed(false)
  // En mobile, tocar un ítem cierra el drawer (AppLayout también lo cierra al cambiar de
  // ruta; esto cubre tocar el ítem de la pantalla en la que ya se está).
  const handleNavigate = isMobile ? onMobileClose : collapsed ? expandOnNavigate : undefined
  const toggleLabel = isMobile
    ? t('layout.closeMenu')
    : collapsed
      ? t('layout.showPanel')
      : t('layout.hidePanel')
  const ToggleIcon = isMobile ? CloseIcon : collapsed ? MenuIcon : MenuOpenIcon

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onMobileClose}
      // keepMounted: el `nav` queda siempre en el DOM, así el aria-controls del botón de
      // menú del header apunta a un elemento real aunque el drawer esté cerrado.
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? undefined : width,
        flexShrink: 0,
        height: isMobile ? undefined : '100%',
        transition: (theme) => theme.transitions.create('width'),
        '& .MuiDrawer-paper': {
          position: isMobile ? 'fixed' : 'relative',
          width: isMobile
            ? `min(${organicLayout.sidebarWidth}px, ${organicLayout.sidebarMobileMaxWidth})`
            : width,
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
          border: 'none',
          background: sidebarColors.gradient,
          paddingTop: organicLayout.safeArea.top,
          paddingBottom: organicLayout.safeArea.bottom,
          paddingLeft: organicLayout.safeArea.left,
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
        component="nav"
        id={id}
        aria-label={t('layout.mainNavigation')}
        sx={{ position: 'relative', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <Box
          sx={{
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
              onClick={isMobile ? onMobileClose : (): void => setCollapsed((prev) => !prev)}
              sx={{
                width: 34,
                height: 34,
                borderRadius: 0,
                backgroundColor: 'rgba(255,253,249,0.08)',
                border: '1px solid rgba(255,253,249,0.18)',
                color: 'rgba(255,253,249,0.75)',
                '&:hover': {
                  backgroundColor: 'rgba(255,253,249,0.18)',
                  color: sidebarColors.onDark
                }
              }}
            >
              <ToggleIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            component={NavLink}
            to={ROUTES.HOME}
            title={t('common.appName')}
            onClick={isMobile ? onMobileClose : undefined}
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
                {t('common.appName')}
              </Typography>
            )}
          </Box>
        </Box>

        <List
          sx={{
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
              onNavigate={handleNavigate}
            />
          ))}
        </List>

        <Box sx={{ px: collapsed ? 1.25 : 2, pb: 2.25, pt: 1.5 }}>
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
          <Box
            sx={{ height: '1px', backgroundColor: 'rgba(255,253,249,0.22)', mb: 1.75, mx: 0.5 }}
          />
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {isDemoMode && (
              <ListItem disablePadding>
                <DemoModeExitButton collapsed={collapsed} />
              </ListItem>
            )}
            <LanguageSidebarButton collapsed={collapsed} />
            <ReloadAppButton collapsed={collapsed} />
            <SidebarItem item={settingsItem} collapsed={collapsed} onNavigate={handleNavigate} />
            <ListItem disablePadding>
              <LogoutButton collapsed={collapsed} />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  )
}
