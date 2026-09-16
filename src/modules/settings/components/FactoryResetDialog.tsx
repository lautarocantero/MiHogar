import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack
} from '@mui/material'
import { useFactoryReset } from '../useFactoryReset'
import { FactoryResetCategory } from '../typings/enums'
import type { FactoryResetDialogProps } from '../typings/props'

const CATEGORY_OPTIONS: Array<{ value: FactoryResetCategory; label: string }> = [
  { value: FactoryResetCategory.ACCOUNTS, label: 'Cuentas y tarjetas' },
  { value: FactoryResetCategory.MOVEMENTS, label: 'Movimientos (gastos e ingresos)' },
  { value: FactoryResetCategory.PAYMENTS, label: 'Pagos y servicios' },
  { value: FactoryResetCategory.SAVINGS, label: 'Ahorros e inversiones' },
  { value: FactoryResetCategory.MEMBERS, label: 'Integrantes del hogar' },
  { value: FactoryResetCategory.CATEGORIES, label: 'Categorías (vuelven a las de fábrica)' },
  { value: FactoryResetCategory.HOUSEHOLD_NAME, label: 'Nombre del hogar' }
]

const ALL_CATEGORIES = CATEGORY_OPTIONS.map((option) => option.value)

export function FactoryResetDialog({ open, onClose }: FactoryResetDialogProps): React.JSX.Element {
  const [selected, setSelected] = useState<FactoryResetCategory[]>([])
  const { submit, isSubmitting, errorMessage } = useFactoryReset(() => {
    setSelected([])
    onClose()
  })

  const toggle = (category: FactoryResetCategory): void => {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    )
  }

  const allSelected = selected.length === ALL_CATEGORIES.length

  const handleClose = (): void => {
    setSelected([])
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="factory-reset-title"
    >
      <DialogTitle id="factory-reset-title">Volver a estado de fábrica</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="warning">
            Esto no se puede deshacer. Elegí qué querés borrar — si dejás algo que otra sección
            todavía usa (por ejemplo cuentas de movimientos que sí borrás), esos registros van a
            quedar sin esa referencia.
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={selected.length > 0 && !allSelected}
                onChange={() => setSelected(allSelected ? [] : ALL_CATEGORIES)}
              />
            }
            label="Seleccionar todo (reinicio completo)"
          />
          <Divider />
          <Stack spacing={0.5}>
            {CATEGORY_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={selected.includes(option.value)}
                    onChange={() => toggle(option.value)}
                  />
                }
                label={option.label}
              />
            ))}
          </Stack>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={() => submit(selected)}
          color="error"
          variant="contained"
          disabled={isSubmitting || selected.length === 0}
        >
          {isSubmitting ? 'Eliminando…' : 'Eliminar lo seleccionado'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
