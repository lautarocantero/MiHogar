import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

export type SidebarItem = {
  label: string
  path: string
  icon: ComponentType<SvgIconProps>
}

export type SidebarAction = {
  label: string
  /** Nombre accesible cuando difiere del texto visible. */
  ariaLabel?: string
  /** Idioma del texto visible, si no es el de la página. */
  lang?: string
  icon: ComponentType<SvgIconProps>
  onClick: () => void
}
