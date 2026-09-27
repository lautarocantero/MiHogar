import { useEffect, useState } from 'react'
import { Card, Stack, Typography } from '@mui/material'
import { PasswordField } from '@/components/shared/PasswordField'
import { useGithubTokenPreference } from '../useGithubTokenPreference'

export function GithubTokenField(): React.JSX.Element {
  const { token, setToken } = useGithubTokenPreference()
  const [draft, setDraft] = useState(token)

  useEffect(() => {
    setDraft(token)
  }, [token])

  return (
    <Card sx={{ p: 3 }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Tablero de tareas — GitHub
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Token fine-grained de solo lectura, limitado al repo `lautarocantero/MiHogar`, para
          sincronizar PRs e issues del tablero de tareas.
        </Typography>
        <PasswordField
          fullWidth
          label="Token de GitHub"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => setToken(draft)}
        />
      </Stack>
    </Card>
  )
}
