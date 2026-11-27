import { Box, Paper, Stack, Typography } from '@mui/material'
import { organicTypography } from '@/theme/tokens'
import logo from '@/assets/images/gastito-logo.png'
import loginBackground from '@/assets/images/login-background.png'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useT } from '@/i18n'
import { DemoModeButton } from './DemoModeButton'
import type { AuthPageLayoutProps } from '../typings/props'

export function AuthPageLayout({
  onDemoClick,
  isDemoLoading = false,
  footer,
  children
}: AuthPageLayoutProps): React.JSX.Element {
  const t = useT()

  return (
    <Box
      component="main"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      minHeight="100dvh"
      px={2}
      py={{ xs: 2, sm: 4 }}
      sx={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* En mobile y tablet van arriba de la tarjeta; en desktop ancho, fijos en la esquina
          (antes de lg la tarjeta centrada de 480px se superpone con la esquina). */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        width="100%"
        maxWidth={480}
        sx={{
          position: { xs: 'static', lg: 'fixed' },
          top: { lg: 24 },
          right: { lg: 24 },
          width: { lg: 'auto' },
          zIndex: 1
        }}
      >
        <LanguageToggle />
        {onDemoClick && <DemoModeButton onClick={onDemoClick} isLoading={isDemoLoading} />}
      </Stack>
      <Paper
        elevation={0}
        sx={{ position: 'relative', zIndex: 1, p: { xs: 3, sm: 5 }, maxWidth: 480, width: '100%' }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" mb={{ xs: 3, sm: 4 }}>
          <Box
            component="img"
            src={logo}
            alt=""
            width={48}
            height={48}
            sx={{ borderRadius: '50%', flexShrink: 0 }}
          />
          <Typography
            variant="h1"
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              color: 'text.primary'
            }}
          >
            {t('common.appName')}
          </Typography>
        </Stack>
        {children}
        {footer && (
          <Box component="footer" mt={3} pt={2} borderTop={1} borderColor="divider">
            {footer}
          </Box>
        )}
      </Paper>
    </Box>
  )
}
