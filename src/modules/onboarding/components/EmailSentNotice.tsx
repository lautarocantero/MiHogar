// EMAILS DESACTIVADOS: sin uso hasta que haya envío de mails (ver AccountAccessPage / AuthGate).
import { Alert, Button, Link, Stack, Typography } from '@mui/material'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import { useT } from '@/i18n'
import type { EmailSentNoticeProps } from '../typings/props'

export function EmailSentNotice({
  title,
  description,
  onBack,
  onResend,
  isResending = false,
  resendMessage,
  resendErrorMessage
}: EmailSentNoticeProps): React.JSX.Element {
  const t = useT()

  return (
    <Stack component="section" spacing={2.5} aria-labelledby="email-sent-title">
      <Stack direction="row" spacing={1.5} alignItems="center">
        <MarkEmailReadOutlinedIcon color="primary" aria-hidden />
        <Typography id="email-sent-title" variant="h6" component="h2">
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
        {description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('auth.emailSent.spamHint')}
      </Typography>
      <Stack role="status" aria-live="polite">
        {resendMessage && <Alert severity="success">{resendMessage}</Alert>}
      </Stack>
      {resendErrorMessage && <Alert severity="error">{resendErrorMessage}</Alert>}
      {onResend && (
        <Button
          variant="outlined"
          onClick={onResend}
          disabled={isResending}
          aria-busy={isResending}
          fullWidth
        >
          {isResending ? t('auth.emailSent.resending') : t('auth.emailSent.resend')}
        </Button>
      )}
      <Link
        component="button"
        type="button"
        variant="body2"
        onClick={onBack}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('auth.backToSignIn')}
      </Link>
    </Stack>
  )
}
