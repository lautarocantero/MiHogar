import { useState } from 'react'
import { Divider, Drawer, List, Toolbar, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import { ROUTES } from '@/router/routes'
import { organicColors } from '@/theme/tokens'
import { SidebarItem } from './SidebarItem'
import { SidebarActionButton } from './SidebarActionButton'
import { useSidebarItems } from './useSidebarItems'

const SIDEBAR_WIDTH = 290
const SIDEBAR_WIDTH_COLLAPSED = 88
const SETTINGS_ITEM = { label: 'Configuración', path: ROUTES.SETTINGS, icon: SettingsIcon }

export function Sidebar(): React.JSX.Element {
  const items = useSidebarItems()
  const [collapsed, setCollapsed] = useState(false)

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH
  const expandOnNavigate = (): void => setCollapsed(false)

  const toggleAction = {
    label: collapsed ? 'Mostrar panel' : 'Ocultar panel',
    icon: collapsed ? MenuIcon : MenuOpenIcon,
    onClick: (): void => setCollapsed((prev) => !prev)
  }

  return (
    <Drawer
      variant="permanent"
      component="nav"
      aria-label="Navegación principal"
      sx={{
        width,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width'),
        '& .MuiDrawer-paper': {
          width,
          overflowX: 'hidden',
          boxSizing: 'border-box',
          borderRight: `1px solid ${organicColors.neutral.border}`,
          backgroundColor: organicColors.surface,
          transition: (theme) => theme.transitions.create('width')
        }
      }}
    >
      <Toolbar sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
        {!collapsed && (
          <Typography variant="h5" component="span" color="text.primary">
            Mi Hogar
          </Typography>
        )}
      </Toolbar>
      <List component="div" sx={{ flexGrow: 1 }}>
        {items.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            onNavigate={collapsed ? expandOnNavigate : undefined}
          />
        ))}
      </List>
      <List component="div">
        <SidebarActionButton action={toggleAction} collapsed={collapsed} />
      </List>
      <Divider />
      <List component="div">
        <SidebarItem
          item={SETTINGS_ITEM}
          collapsed={collapsed}
          onNavigate={collapsed ? expandOnNavigate : undefined}
        />
      </List>
    </Drawer>
  )
}
