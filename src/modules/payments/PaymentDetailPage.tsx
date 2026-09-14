import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Chip, Grid2 as Grid, Link as MuiLink, Stack, Typography } from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { resolveFrequencyLabel } from '@/utils/domain/resolveFrequencyLabel'
import { resolveUrlHostname } from '@/utils/resolveUrlHostname'
import { PaymentStatus } from '@/typings/domain/enums'
import { usePaymentDetailData } from './hooks/usePaymentDetailData'
import { useMarkPaymentAsPaid } from './hooks/useMarkPaymentAsPaid'
import { useUnlockCredentials } from './hooks/useUnlockCredentials'
import { usePaymentHistory } from './hooks/usePaymentHistory'
import { SectionLockGate } from './components/SectionLockGate'
import { CredentialsPanel } from './components/CredentialsPanel'
import { AttachmentList } from './components/AttachmentList'
import { PaymentHistoryCard } from './components/PaymentHistoryCard'
import { EditCredentialsDialog } from './components/EditCredentialsDialog'
import { PlaceholderPage } from '@/modules/placeholder/PlaceholderPage'

export function PaymentDetailPage(): React.JSX.Element {
  const { paymentId } = useParams<{ paymentId: string }>()
  const payment = usePaymentDetailData(paymentId ?? '')
  const { markAsPaid, isSubmitting } = useMarkPaymentAsPaid(payment)
  const unlockCredentials = useUnlockCredentials()
  const history = usePaymentHistory(paymentId ?? '')
  const [isEditCredentialsOpen, setIsEditCredentialsOpen] = useState(false)

  if (!payment) {
    return <PlaceholderPage title="No encontramos este pago" />
  }

  const frequencyLabel = resolveFrequencyLabel(payment.frequency)

  return (
    <Grid container spacing={4} component="section" aria-label="Detalle del pago">
      <Grid size={{ xs: 12, md: 7 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={
                payment.status === PaymentStatus.PAID ? 'Pagado' : formatDueLabel(payment.dueDate)
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

          <Box>
            <Typography variant="body1" color="text.secondary">
              Cuánto hay que pagar
            </Typography>
            <Typography
              variant="h2"
              component="p"
              sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}
            >
              {formatCurrency(payment.amount)}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {[
              { label: 'Concepto', value: payment.concept },
              { label: 'Entidad', value: payment.entity },
              { label: 'Se paga con', value: payment.accountName },
              { label: 'A nombre de', value: payment.ownerLabel }
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
                  <Typography variant="body1">{field.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              size="large"
              disabled={payment.status === PaymentStatus.PAID || isSubmitting}
              onClick={markAsPaid}
            >
              {payment.status === PaymentStatus.PAID ? 'Ya está pagado' : 'Marcar como pagado'}
            </Button>
            {payment.providerUrl && (
              <Button
                variant="outlined"
                size="large"
                component={MuiLink}
                href={payment.providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LaunchIcon />}
              >
                Pagar en {resolveUrlHostname(payment.providerUrl)}
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
              Editar datos de acceso
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
    </Grid>
  )
}
