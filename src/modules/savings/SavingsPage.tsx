import { useState } from 'react'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import SavingsIcon from '@mui/icons-material/Savings'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FlagIcon from '@mui/icons-material/Flag'
import { organicColors, organicTypography } from '@/theme/tokens'
import { SavingsSummaryCards } from './components/SavingsSummaryCards'
import { SavingsInstrumentRow } from './components/SavingsInstrumentRow'
import { SavingsGoalRow } from './components/SavingsGoalRow'
import { SavingsEvolutionChart } from './components/SavingsEvolutionChart'
import { MonthSummaryCard } from './components/MonthSummaryCard'
import { AddSavingsDialog } from './components/AddSavingsDialog'
import { AddSavingsGoalDialog } from './components/AddSavingsGoalDialog'
import { EditSavingsGoalDialog } from './components/EditSavingsGoalDialog'
import { DeleteSavingsGoalDialog } from './components/DeleteSavingsGoalDialog'
import { useSavingsData } from './useSavingsData'
import { useSyncSavingsSnapshot } from './useSyncSavingsSnapshot'
import type { SavingsGoalView } from './typings/types'

const TIPS = [
  {
    title: 'Invertir de forma constante',
    text: 'Aunque sea un monto pequeño, la constancia es clave para que tu dinero crezca con el tiempo.'
  },
  {
    title: 'Separá un fondo de emergencia',
    text: 'Tener 3 a 6 meses de gastos guardados te evita tocar tus inversiones ante un imprevisto.'
  },
  {
    title: 'Revisá tus plazos',
    text: 'Si un plazo fijo vence pronto, decidí con tiempo si lo renovás o lo pasás a otra meta.'
  }
]

const cardBorderSx = { border: `1px solid ${organicColors.neutral.border}` }

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

export function SavingsPage(): React.JSX.Element {
  const { summary, savingsInstruments, investmentInstruments, goals, evolution, monthSummary } =
    useSavingsData()
  useSyncSavingsSnapshot(summary.totalSaved - summary.totalInvested, summary.totalInvested)

  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoalView | null>(null)
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoalView | null>(null)
  const [tipIndex, setTipIndex] = useState(0)
  const tip = TIPS[tipIndex]

  return (
    <Stack spacing={3} component="section" aria-label="Ahorros e inversiones">
      <SavingsSummaryCards summary={summary} />

      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%', ...cardBorderSx }} elevation={0}>
            <Box mb={2}>
              <SectionHeading icon={<ShowChartIcon sx={{ color: organicColors.orange.dark }} />}>
                Evolución de ahorros e inversiones
              </SectionHeading>
            </Box>
            <SavingsEvolutionChart points={evolution} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%', ...cardBorderSx }} elevation={0}>
            <Box mb={1.75}>
              <SectionHeading
                icon={<CalendarMonthIcon sx={{ color: organicColors.orange.dark }} />}
              >
                Resumen del mes
              </SectionHeading>
            </Box>
            <MonthSummaryCard items={monthSummary} />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, ...cardBorderSx }} elevation={0}>
            <Stack direction="row" alignItems="center" mb={2} gap={2} flexWrap="wrap">
              <SectionHeading icon={<FlagIcon sx={{ color: organicColors.orange.dark }} />}>
                Tus metas de ahorro
              </SectionHeading>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ ml: 'auto' }}
                onClick={() => setIsAddGoalOpen(true)}
              >
                Agregar meta
              </Button>
            </Stack>
            {goals.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Todavía no tenés metas de ahorro cargadas.
              </Typography>
            ) : (
              <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {goals.map((goal) => (
                  <SavingsGoalRow
                    key={goal.id}
                    goal={goal}
                    onEdit={setEditingGoal}
                    onDelete={setDeletingGoal}
                  />
                ))}
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Card sx={{ p: 2.5, ...cardBorderSx }} elevation={0}>
              <Box mb={1.5}>
                <SectionHeading icon={<LightbulbIcon sx={{ color: '#e8b93f' }} />}>
                  Consejos para vos
                </SectionHeading>
              </Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  backgroundColor: '#faf0e4',
                  border: '1px solid #efdcc6',
                  p: 2,
                  mb: 1.5
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    backgroundColor: '#f2dcc3',
                    color: organicColors.sage.main
                  }}
                >
                  <SavingsIcon />
                </Box>
                <Stack spacing={0.5} minWidth={0}>
                  <Typography sx={{ fontWeight: 700, color: organicColors.orange.dark }}>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tip.text}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="center">
                {TIPS.map((_, index) => (
                  <Box
                    key={index}
                    component="button"
                    type="button"
                    aria-label="Consejo"
                    onClick={() => setTipIndex(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      p: 0,
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      backgroundColor: index === tipIndex ? organicColors.orange.dark : '#e0d2c2'
                    }}
                  />
                ))}
              </Stack>
            </Card>

            {investmentInstruments.length > 0 && (
              <Card sx={{ p: 2.5, ...cardBorderSx }} elevation={0}>
                <Box mb={1.5}>
                  <SectionHeading
                    icon={<TrendingUpIcon sx={{ color: organicColors.income.main }} />}
                  >
                    Tus inversiones
                  </SectionHeading>
                </Box>
                <Stack spacing={1.25} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {investmentInstruments.map((instrument) => (
                    <SavingsInstrumentRow key={instrument.id} instrument={instrument} />
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
          <SectionHeading icon={<SavingsIcon sx={{ color: organicColors.orange.dark }} />}>
            Ahorros
          </SectionHeading>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddSavingsOpen(true)}
          >
            Agregar un ahorro
          </Button>
        </Stack>

        {savingsInstruments.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Todavía no agregaste ningún ahorro.
          </Typography>
        ) : (
          <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {savingsInstruments.map((instrument) => (
              <SavingsInstrumentRow key={instrument.id} instrument={instrument} />
            ))}
          </Stack>
        )}
      </Box>

      <AddSavingsDialog open={isAddSavingsOpen} onClose={() => setIsAddSavingsOpen(false)} />
      <AddSavingsGoalDialog open={isAddGoalOpen} onClose={() => setIsAddGoalOpen(false)} />
      {editingGoal && (
        <EditSavingsGoalDialog
          goal={editingGoal}
          open={Boolean(editingGoal)}
          onClose={() => setEditingGoal(null)}
        />
      )}
      {deletingGoal && (
        <DeleteSavingsGoalDialog
          goal={deletingGoal}
          open={Boolean(deletingGoal)}
          onClose={() => setDeletingGoal(null)}
          onDeleted={() => setDeletingGoal(null)}
        />
      )}
    </Stack>
  )
}
