import { useMemo, useState } from 'react'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DonutSmallIcon from '@mui/icons-material/DonutSmall'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { formatDueLabel } from '@/utils/formatting/formatDate'
import { DonutChart } from '@/components/shared/DonutChart'
import { DebtStatus } from '@/typings/domain/enums'
import { DebtsSummaryCards } from './components/DebtsSummaryCards'
import { DebtRow } from './components/DebtRow'
import { AddDebtDialog } from './components/AddDebtDialog'
import { EditDebtDialog } from './components/EditDebtDialog'
import { DeleteDebtDialog } from './components/DeleteDebtDialog'
import { useDebtsData } from './useDebtsData'
import type { DebtView } from './typings/types'

const DEBT_COLORS = ['#b5502a', '#e0854f', '#f3d3b8', '#7a5aa8', '#3f6a8a', '#8c7a5f']

function SectionHeading({
  icon,
  children
}: {
  icon: React.ReactNode
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      {icon}
      <Typography
        component="h2"
        sx={{
          fontFamily: organicTypography.titleFontFamily,
          fontSize: '1.25rem',
          fontWeight: 400,
          color: organicColors.orange.dark
        }}
      >
        {children}
      </Typography>
    </Stack>
  )
}

export function DebtsPage(): React.JSX.Element {
  const { summary, owedByHousehold, owedToHousehold } = useDebtsData()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<DebtView | null>(null)
  const [deletingDebt, setDeletingDebt] = useState<DebtView | null>(null)

  const activeDebts = owedByHousehold.filter((debt) => debt.status === DebtStatus.ACTIVE)

  const upcomingDue = useMemo(
    () =>
      activeDebts
        .filter((debt) => debt.nextInstallmentDate)
        .sort((a, b) => (a.nextInstallmentDate ?? '').localeCompare(b.nextInstallmentDate ?? ''))
        .slice(0, 4),
    [activeDebts]
  )

  const donutSegments = activeDebts
    .filter((debt) => debt.outstandingBalance > 0)
    .map((debt, index) => ({
      label: debt.name,
      amountLabel: formatCurrency(debt.outstandingBalance),
      percent:
        summary.totalOwedByHousehold > 0
          ? (debt.outstandingBalance / summary.totalOwedByHousehold) * 100
          : 0,
      color: DEBT_COLORS[index % DEBT_COLORS.length]
    }))

  return (
    <Stack spacing={3} component="section" aria-label="Deudas y préstamos">
      <DebtsSummaryCards summary={summary} activeCount={activeDebts.length} />

      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              p: 2.5,
              backgroundColor: organicColors.surface,
              border: `1px solid ${organicColors.neutral.border}`
            }}
            elevation={0}
          >
            <Box mb={2}>
              <SectionHeading icon={<DonutSmallIcon sx={{ color: organicColors.orange.dark }} />}>
                Composición de tus deudas
              </SectionHeading>
            </Box>
            {donutSegments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tenés deudas activas para mostrar acá.
              </Typography>
            ) : (
              <DonutChart
                segments={donutSegments}
                centerValue={formatCurrency(summary.totalOwedByHousehold)}
                centerLabel="Total adeudado"
              />
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              p: 2.5,
              height: '100%',
              backgroundColor: organicColors.surface,
              border: `1px solid ${organicColors.neutral.border}`
            }}
            elevation={0}
          >
            <Box mb={1.5}>
              <SectionHeading icon={<EventIcon sx={{ color: organicColors.orange.dark }} />}>
                Próximos vencimientos
              </SectionHeading>
            </Box>
            {upcomingDue.length === 0 ? (
              <Stack
                direction="row"
                spacing={1.75}
                alignItems="flex-start"
                sx={{
                  backgroundColor: organicColors.income.tint,
                  border: `1px solid ${organicColors.income.border}`,
                  p: 1.75
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    backgroundColor: organicColors.income.iconBg,
                    color: organicColors.income.main
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                </Box>
                <Stack spacing={0.25}>
                  <Typography
                    sx={{
                      fontFamily: organicTypography.titleFontFamily,
                      color: organicColors.income.main
                    }}
                  >
                    ¡Vas bien!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No tenés vencimientos próximos cargados.
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={1.25} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {upcomingDue.map((debt) => (
                  <Stack
                    key={debt.id}
                    component="li"
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ border: `1px solid ${organicColors.neutral.border}`, p: 1.25 }}
                  >
                    <Box flexGrow={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {debt.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {debt.counterparty}
                      </Typography>
                    </Box>
                    <Stack alignItems="flex-end" spacing={0.25}>
                      {debt.installmentAmount != null && (
                        <Typography
                          sx={{
                            fontFamily: organicTypography.titleFontFamily,
                            fontSize: '0.9375rem',
                            color: organicColors.orange.dark
                          }}
                        >
                          {formatCurrency(debt.installmentAmount)}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {formatDueLabel(debt.nextInstallmentDate as string)}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddOpen(true)}>
          Agregar deuda o préstamo
        </Button>
      </Stack>

      <Card
        sx={{
          p: 2.5,
          backgroundColor: organicColors.surface,
          border: `1px solid ${organicColors.neutral.border}`
        }}
        elevation={0}
      >
        <Box mb={2}>
          <SectionHeading icon={<RequestQuoteIcon sx={{ color: organicColors.overdue.main }} />}>
            Lo que debemos
          </SectionHeading>
        </Box>
        {owedByHousehold.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No tenés deudas cargadas.
          </Typography>
        ) : (
          <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {owedByHousehold.map((debt) => (
              <DebtRow
                key={debt.id}
                debt={debt}
                onEdit={setEditingDebt}
                onDelete={setDeletingDebt}
              />
            ))}
          </Stack>
        )}
      </Card>

      <Card
        sx={{
          p: 2.5,
          backgroundColor: organicColors.surface,
          border: `1px solid ${organicColors.neutral.border}`
        }}
        elevation={0}
      >
        <Box mb={2}>
          <SectionHeading icon={<CallReceivedIcon sx={{ color: organicColors.income.main }} />}>
            Lo que nos deben
          </SectionHeading>
        </Box>
        {owedToHousehold.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No prestaste plata todavía.
          </Typography>
        ) : (
          <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {owedToHousehold.map((debt) => (
              <DebtRow
                key={debt.id}
                debt={debt}
                onEdit={setEditingDebt}
                onDelete={setDeletingDebt}
              />
            ))}
          </Stack>
        )}
      </Card>

      <AddDebtDialog open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      {editingDebt && (
        <EditDebtDialog
          debt={editingDebt}
          open={Boolean(editingDebt)}
          onClose={() => setEditingDebt(null)}
        />
      )}
      {deletingDebt && (
        <DeleteDebtDialog
          debt={deletingDebt}
          open={Boolean(deletingDebt)}
          onClose={() => setDeletingDebt(null)}
          onDeleted={() => setDeletingDebt(null)}
        />
      )}
    </Stack>
  )
}
