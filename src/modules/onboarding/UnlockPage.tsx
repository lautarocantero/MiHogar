import { Box, Paper } from '@mui/material'
import { UnlockForm } from './components/UnlockForm'
import { useUnlockVault } from './useUnlockVault'

export function UnlockPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useUnlockVault()

  return (
    <Box
      component="main"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={2}
    >
      <Paper sx={{ p: 5, maxWidth: 480, width: '100%' }} elevation={0}>
        <UnlockForm onSubmit={submit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      </Paper>
    </Box>
  )
}
