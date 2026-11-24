import { Box, Stack, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
import type { CredentialsPanelProps } from '../typings/props'
import { useT } from '@/i18n'

const CREDENTIAL_FIELDS: Array<{
  key: 'username' | 'password' | 'clientNumber'
  labelKey: string
}> = [
  { key: 'username', labelKey: 'payments.credentials.username' },
  { key: 'password', labelKey: 'payments.credentials.password' },
  { key: 'clientNumber', labelKey: 'payments.credentials.clientNumber' }
]

export function CredentialsPanel({ credentials }: CredentialsPanelProps): React.JSX.Element {
  const t = useT()
  if (!credentials) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('payments.credentials.empty')}
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
            {t(field.labelKey)}
          </Typography>
          <Typography variant="body1" fontFamily="monospace">
            {credentials[field.key]}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}
