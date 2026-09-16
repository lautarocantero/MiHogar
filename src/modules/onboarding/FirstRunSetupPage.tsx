import { Box, Paper } from '@mui/material'
import { CreateHouseholdKeyForm } from './components/CreateHouseholdKeyForm'
import { DemoModeButton } from './components/DemoModeButton'
import { useCreateHousehold } from './useCreateHousehold'
import { useEnterDemoMode } from './useEnterDemoMode'

export function FirstRunSetupPage(): React.JSX.Element {
  const { submit, isSubmitting, errorMessage } = useCreateHousehold()
  const { enterDemo, isEntering } = useEnterDemoMode()

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
      <DemoModeButton onClick={enterDemo} isLoading={isEntering} />
      <Paper sx={{ p: 5, maxWidth: 480, width: '100%' }} elevation={0}>
        <CreateHouseholdKeyForm
          onSubmit={submit}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </Paper>
    </Box>
  )
}
