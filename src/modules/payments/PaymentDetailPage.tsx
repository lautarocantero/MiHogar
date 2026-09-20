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
import { resolveUrlHostname } from '@/utils/resolveUrlHostname'
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

export function PaymentDetailPage(): React.JSX.Element {
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
    return <PlaceholderPage title="No encontramos este pago" />
  }

  const frequencyLabel = resolveFrequencyLabel(payment.frequency)
  const isDeposit = payment.kind === PaymentKind.DEPOSIT
  const isVariableUnset = payment.amountMode === AmountMode.VARIABLE && payment.amount === 0

  return (
    <Grid container spacing={4} component="section" aria-label="Detalle del pago">
      <Grid size={{ xs: 12, md: 7 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={
                  payment.status === PaymentStatus.PAID
                    ? isDeposit
                      ? 'Recibido'
                      : 'Pagado'
                    : formatDueLabel(payment.displayDate, isDeposit ? 'Entra' : 'Vence')
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
              aria-label={`Opciones de ${payment.concept}`}
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
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null)
                  setIsDeletePaymentOpen(true)
                }}
              >
                Eliminar
              </MenuItem>
            </Menu>
          </Stack>

          <Box>
            <Typography variant="body1" color="text.secondary">
              {isDeposit ? 'Cuánto vas a recibir' : 'Cuánto hay que pagar'}
            </Typography>
            <Typography
              variant="h2"
              component="p"
              sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}
            >
              {isVariableUnset ? 'A confirmar' : formatCurrency(payment.amount)}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {[
              { label: 'Concepto', value: payment.concept },
              { label: 'Entidad', value: payment.entity },
              { label: isDeposit ? 'Entra a' : 'Se paga con', value: payment.accountName },
              { label: 'A nombre de', value: payment.ownerLabel },
              ...(typeof payment.installmentsTotal === 'number'
                ? [
                    {
                      label: 'Cuotas',
                      value: `${payment.installmentsPaid ?? 0} de ${payment.installmentsTotal} (quedan ${computeInstallmentsRemaining(payment)})`
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
                  <Typography variant="body1">{field.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {payment.status === PaymentStatus.PAID ? (
              <Button variant="outlined" size="large" disabled={isCancelling} onClick={cancel}>
                {isDeposit ? 'Cancelar cobro' : 'Cancelar pago'}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                disabled={isMarkingPaid || isVariableUnset}
                onClick={markAsPaid}
              >
                {isDeposit ? 'Marcar como recibido' : 'Marcar como pagado'}
              </Button>
            )}
            {isVariableUnset && payment.status !== PaymentStatus.PAID && (
              <Typography variant="body2" color="text.secondary" width="100%">
                Editá el pago para cargar el monto recibido antes de confirmarlo.
              </Typography>
            )}
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
