import { Box, Paper, Stack, Typography } from '@mui/material'
import { organicTypography } from '@/theme/tokens'
import logo from '@/assets/images/mi-hogar-logo.png'
import loginBackground from '@/assets/images/login-background.png'
import { DemoModeButton } from './DemoModeButton'
import type { AuthPageLayoutProps } from '../typings/props'

export function AuthPageLayout({
  onDemoClick,
  isDemoLoading,
  children
}: AuthPageLayoutProps): React.JSX.Element {
  return (
    <Box
      component="main"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
      overflow="hidden"
      sx={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Box position="fixed" top={24} right={24} zIndex={1}>
        <DemoModeButton onClick={onDemoClick} isLoading={isDemoLoading} />
      </Box>
      <Paper
        elevation={0}
        sx={{ position: 'relative', zIndex: 1, p: 5, maxWidth: 480, width: '100%' }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
          <Box
            component="img"
            src={logo}
            alt=""
            sx={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }}
          />
          <Typography
            variant="h1"
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: '2rem',
              color: 'text.primary'
            }}
          >
            Mi hogar
          </Typography>
        </Stack>
        {children}
      </Paper>
    </Box>
  )
}
