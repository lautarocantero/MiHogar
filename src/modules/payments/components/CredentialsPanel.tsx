import { Box, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import type { CredentialsPanelProps } from '../typings/props'

const CREDENTIAL_FIELDS: Array<{ key: 'username' | 'password' | 'clientNumber'; label: string }> = [
  { key: 'username', label: 'Usuario' },
  { key: 'password', label: 'Contraseña' },
  { key: 'clientNumber', label: 'Número de cliente' }
]

export function CredentialsPanel({ credentials }: CredentialsPanelProps): React.JSX.Element {
  if (!credentials) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay datos de acceso guardados para este pago.
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      {CREDENTIAL_FIELDS.filter((field) => credentials[field.key]).map((field) => (
        <Box
          key={field.key}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: organicColors.surface,
            border: `1px solid ${organicColors.neutral.border}`
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {field.label}
          </Typography>
          <Typography variant="body1" fontFamily="monospace">
            {credentials[field.key]}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}
