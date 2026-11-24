import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import { isHttpUrl, resolveUrlHostname } from '@/utils/resolveUrlHostname'
import { computeInstallmentsRemaining } from '@/utils/domain/computeInstallmentsRemaining'
import { AmountMode, PaymentKind, PaymentStatus } from '@/typings/domain/enums'
import { ROUTES } from '@/router/routes'
import { usePaymentDetailData } from './hooks/usePaymentDetailData'
import { useMarkPaymentAsPaid } from './hooks/useMarkPaymentAsPaid'
import { useCancelPayment } from './hooks/useCancelPayment'
import { useUnlockCredentials } from './hooks/useUnlockCredentials'
import { usePaymentHistory } from './hooks/usePaymentHistory'
import { SectionLockGate } from './components/SectionLockGate'
import { CredentialsPanel } from './components/CredentialsPanel'
import { AttachmentList } from './components/AttachmentList'
import { PaymentHistoryCard } from './components/PaymentHistoryCard'
import { EditCredentialsDialog } from './components/EditCredentialsDialog'
import { EditPaymentDialog } from './components/EditPaymentDialog'
import { DeletePaymentDialog } from './components/DeletePaymentDialog'
import { PlaceholderPage } from '@/modules/placeholder/PlaceholderPage'
import { useT } from '@/i18n'

export function PaymentDetailPage(): React.JSX.Element {
  const t = useT()
  const { paymentId } = useParams<{ paymentId: string }>()
  const navigate = useNavigate()
  const payment = usePaymentDetailData(paymentId ?? '')
  const { markAsPaid, isSubmitting: isMarkingPaid } = useMarkPaymentAsPaid(payment)
  const { cancel, isSubmitting: isCancelling } = useCancelPayment(payment)
  const unlockCredentials = useUnlockCredentials(paymentId ?? '')
  const history = usePaymentHistory(paymentId ?? '')
  const [isEditCredentialsOpen, setIsEditCredentialsOpen] = useState(false)
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false)
  const [isDeletePaymentOpen, setIsDeletePaymentOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  if (!payment) {
    return <PlaceholderPage title={t('payments.detail.notFound')} />
  }

  const frequencyLabel = resolveFrequencyLabel(payment.frequency)
  const isDeposit = payment.kind === PaymentKind.DEPOSIT
  const isVariableUnset = payment.amountMode === AmountMode.VARIABLE && payment.amount === 0

  return (
    <Grid container spacing={{ xs: 3, md: 4 }} component="section" aria-label={t('payments.detail.pageLabel')}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={
                  payment.status === PaymentStatus.PAID
                    ? isDeposit
                      ? t('payments.status.received')
                      : t('payments.status.paid')
                    : formatDueLabel(payment.displayDate, isDeposit ? 'incoming' : 'due')
                }
                sx={{
                  backgroundColor:
                    payment.status === PaymentStatus.PAID
                      ? organicColors.sage.tint
                      : organicColors.orange.tint,
                  color:
                    payment.status === PaymentStatus.PAID
                      ? organicColors.sage.dark
                      : organicColors.orange.dark
                }}
              />
              <Chip
                label={`${payment.categoryName}${frequencyLabel ? ` · ${frequencyLabel}` : ''}`}
                variant="outlined"
              />
            </Stack>
            <IconButton
              aria-label={t('payments.detail.optionsFor', { name: payment.concept })}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null)
                  setIsEditPaymentOpen(true)
                }}
              >
                {t('common.edit')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null)
                  setIsDeletePaymentOpen(true)
                }}
              >
                {t('common.delete')}
              </MenuItem>
            </Menu>
          </Stack>

          <Box>
            <Typography variant="body1" color="text.secondary">
              {isDeposit ? t('payments.detail.toReceive') : t('payments.detail.toPay')}
            </Typography>
            <Typography
              variant="h2"
              component="p"
              sx={{
                fontSize: { xs: '2.25rem', sm: '2.5rem', md: '3.75rem' },
                overflowWrap: 'anywhere'
              }}
            >
              {isVariableUnset ? t('payments.toConfirm') : formatCurrency(payment.amount)}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {[
              { label: t('payments.detail.concept'), value: payment.concept },
              { label: t('payments.detail.entity'), value: payment.entity },
              { label: isDeposit ? t('payments.detail.goesTo') : t('payments.detail.paidWith'), value: payment.accountName },
              { label: t('payments.detail.owner'), value: payment.ownerLabel },
              ...(typeof payment.installmentsTotal === 'number'
                ? [
                    {
                      label: t('payments.detail.installments'),
                      value: t('payments.detail.installmentsValue', {
                        paid: payment.installmentsPaid ?? 0,
                        total: payment.installmentsTotal ?? 0,
                        remaining: computeInstallmentsRemaining(payment) ?? 0
                      })
                    }
                  ]
                : [])
            ].map((field) => (
              <Grid key={field.label} size={{ xs: 12, sm: 6 }}>
                <Box
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
                  <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                    {field.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {payment.status === PaymentStatus.PAID ? (
              <Button variant="outlined" size="large" disabled={isCancelling} onClick={cancel}>
                {isDeposit ? t('payments.action.cancelDeposit') : t('payments.action.cancelPayment')}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                disabled={isMarkingPaid || isVariableUnset}
                onClick={markAsPaid}
              >
                {isDeposit ? t('payments.action.markReceived') : t('payments.action.markPaid')}
              </Button>
            )}
            {isVariableUnset && payment.status !== PaymentStatus.PAID && (
              <Typography variant="body2" color="text.secondary" width="100%">
                {t('payments.detail.variableHint')}
              </Typography>
            )}
            {payment.providerUrl && isHttpUrl(payment.providerUrl) && (
              <Button
                variant="outlined"
                size="large"
                component={MuiLink}
                href={payment.providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LaunchIcon />}
              >
                {t('payments.detail.payAt', { site: resolveUrlHostname(payment.providerUrl) })}
              </Button>
            )}
          </Stack>

          <AttachmentList payment={payment} />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={3}>
          <SectionLockGate
            isUnlocked={unlockCredentials.isUnlocked}
            onSubmit={unlockCredentials.submit}
            onHide={unlockCredentials.hide}
            isVerifying={unlockCredentials.isVerifying}
            errorMessage={unlockCredentials.errorMessage}
          >
            <CredentialsPanel credentials={payment.credentials} />
            <Button variant="text" onClick={() => setIsEditCredentialsOpen(true)}>
              {t('payments.credentials.edit')}
            </Button>
          </SectionLockGate>

          <PaymentHistoryCard history={history} />
        </Stack>
      </Grid>

      <EditCredentialsDialog
        payment={payment}
        open={isEditCredentialsOpen}
        onClose={() => setIsEditCredentialsOpen(false)}
      />
      <EditPaymentDialog
        payment={payment}
        open={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
      />
      <DeletePaymentDialog
        payment={payment}
        open={isDeletePaymentOpen}
        onClose={() => setIsDeletePaymentOpen(false)}
        onDeleted={() => navigate(ROUTES.PAYMENTS)}
      />
    </Grid>
  )
}
