export type AppHeaderProps = {
  onOpenQuickAdd: () => void
  /** Solo en mobile: muestra el botón de menú que abre el drawer de navegación. */
  navigation?: {
    controlsId: string
    isOpen: boolean
    onOpen: () => void
  }
}
