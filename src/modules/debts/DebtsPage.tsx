import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DebtsSummaryCards } from './components/DebtsSummaryCards'
import { DebtRow } from './components/DebtRow'
import { AddDebtDialog } from './components/AddDebtDialog'
import { EditDebtDialog } from './components/EditDebtDialog'
import { DeleteDebtDialog } from './components/DeleteDebtDialog'
import { useDebtsData } from './useDebtsData'
import type { DebtView } from './typings/types'

export function DebtsPage(): React.JSX.Element {
  const { summary, owedByHousehold, owedToHousehold } = useDebtsData()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<DebtView | null>(null)
  const [deletingDebt, setDeletingDebt] = useState<DebtView | null>(null)

  return (
    <Stack spacing={4} component="section" aria-label="Deudas y préstamos">
      <DebtsSummaryCards summary={summary} />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddOpen(true)}>
          Agregar deuda o préstamo
        </Button>
      </Stack>

      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Lo que debemos
        </Typography>
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
      </Box>

      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          Lo que nos deben
        </Typography>
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
      </Box>

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
