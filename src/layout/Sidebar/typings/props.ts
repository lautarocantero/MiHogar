import type { SidebarAction, SidebarItem } from './types'

export type SidebarItemProps = {
  item: SidebarItem
  collapsed?: boolean
  onNavigate?: () => void
}

export type SidebarActionButtonProps = {
  action: SidebarAction
  collapsed?: boolean
}

export type SidebarProps = {
  /** id del `nav`, referenciado por el `aria-controls` del botón de menú del header. */
  id: string
  /** Por debajo de `md` el sidebar es un drawer temporal en vez de un panel fijo. */
  isMobile: boolean
  /** Solo aplica en mobile: si el drawer está abierto. */
  mobileOpen: boolean
  onMobileClose: () => void
}
