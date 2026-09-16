import { forwardRef, useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export const PasswordField = forwardRef<HTMLDivElement, TextFieldProps>(function PasswordField(
  { slotProps, ...props },
  ref
) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TextField
      {...props}
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      slotProps={{
        ...slotProps,
        input: {
          ...(slotProps?.input as Record<string, unknown>),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setIsVisible((prev) => !prev)}
                edge="end"
                tabIndex={-1}
              >
                {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  )
})
