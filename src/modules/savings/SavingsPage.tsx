import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SavingsSummaryCards } from './components/SavingsSummaryCards'
import { SavingsInstrumentRow } from './components/SavingsInstrumentRow'
import { AddSavingsDialog } from './components/AddSavingsDialog'
import { useSavingsData } from './useSavingsData'

export function SavingsPage(): React.JSX.Element {
  const { summary, instruments } = useSavingsData()
  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false)

  return (
    <Stack spacing={4} component="section" aria-label="Ahorros e inversiones">
      <SavingsSummaryCards summary={summary} />

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
          <Typography variant="h6" component="h2">
            Dónde está guardado
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddSavingsOpen(true)}
          >
            Agregar un ahorro
          </Button>
        </Stack>

        {instruments.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Todavía no agregaste ningún ahorro.
          </Typography>
        ) : (
          <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {instruments.map((instrument) => (
              <SavingsInstrumentRow key={instrument.id} instrument={instrument} />
            ))}
          </Stack>
        )}
      </Box>

      <AddSavingsDialog open={isAddSavingsOpen} onClose={() => setIsAddSavingsOpen(false)} />
    </Stack>
  )
}
