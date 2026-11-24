import { useEffect, useState } from 'react'
import { Alert, Box, Collapse } from '@mui/material'
import type { AlertColor } from '@mui/material'

type FormErrorAlertProps = {
  message: string | null
  severity?: AlertColor
  /** Separación con el elemento de arriba (misma unidad que `spacing` del Stack padre). */
  gap?: number
}

/**
 * Error de formulario que entra y sale con una transición de altura, para que el resto del
 * formulario no salte. Va dentro de un `Stack` con `spacing`: anula el margen que le pone el
 * Stack y aplica la separación por dentro, así no queda un hueco cuando está oculto.
 */
export function FormErrorAlert({
  message,
  severity = 'error',
  gap = 2.5
}: FormErrorAlertProps): React.JSX.Element {
  // Se conserva el último mensaje mientras se cierra, para que no se vacíe a mitad de camino.
  const [shownMessage, setShownMessage] = useState(message)
  useEffect(() => {
    if (message) setShownMessage(message)
  }, [message])

  return (
    <Collapse in={Boolean(message)} sx={{ mt: '0 !important' }} unmountOnExit>
      <Box pt={gap}>
        <Alert severity={severity}>{message ?? shownMessage}</Alert>
      </Box>
    </Collapse>
  )
}
