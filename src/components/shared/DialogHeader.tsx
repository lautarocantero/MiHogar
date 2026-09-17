import { DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { DialogHeaderProps } from './typings/props'

export function DialogHeader({ id, onClose, children }: DialogHeaderProps): React.JSX.Element {
  return (
    <DialogTitle id={id} sx={{ pr: 6, position: 'relative' }}>
      {children}
      <IconButton
        aria-label="Cerrar"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  )
}
