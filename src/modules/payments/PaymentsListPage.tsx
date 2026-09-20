import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TuneIcon from '@mui/icons-material/Tune'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { organicColors, organicTypography } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import type { Movement } from '@/typings/domain/types'
import { EditMovementDialog } from '@/modules/timeline/components/EditMovementDialog'
import { DeleteMovementDialog } from '@/modules/timeline/components/DeleteMovementDialog'
import { PaymentsTable } from './components/PaymentsTable'
import { EditPaymentDialog } from './components/EditPaymentDialog'
import { DeletePaymentDialog } from './components/DeletePaymentDialog'
import { usePaymentFilters } from './hooks/usePaymentFilters'
import {
  PaymentFilter,
  PaymentMethodFilter,
  PaymentSortBy,
  PaymentTypeFilter
} from './typings/enums'
import type { PaymentColumnKey } from './typings/props'
import type { PaymentView } from './typings/types'

const ALL = 'ALL'

const COLUMN_TOGGLES: Array<{ key: PaymentColumnKey; label: string }> = [
  { key: 'date', label: 'Fecha' },
  { key: 'title', label: 'Título' },
  { key: 'status', label: 'Estado' },
  { key: 'method', label: 'Método de pago' },
  { key: 'type', label: 'Tipo de pago' },
  { key: 'account', label: 'Cuenta' },
  { key: 'category', label: 'Categoría' },
  { key: 'owner', label: 'De quién es' },
  { key: 'mode', label: 'Monto fijo/variable' }
]

type PaymentsListLocationState = { focusEntryId?: string } | null

export function PaymentsListPage(): React.JSX.Element {
  const location = useLocation()
  const focusEntryId = (location.state as PaymentsListLocationState)?.focusEntryId ?? null
  const {
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    methodFilter,
    setMethodFilter,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    categoryFilter,
    setCategoryFilter,
    ownerFilter,
    setOwnerFilter,
    accountOptions,
    categoryOptions,
    ownerOptions,
    filteredEntries,
    totalAmount
  } = usePaymentFilters(focusEntryId ? PaymentFilter.ALL : PaymentFilter.PENDING)
  const [editingPayment, setEditingPayment] = useState<PaymentView | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<PaymentView | null>(null)
  const [editingMovement, setEditingMovement] = useState<Movement | null>(null)
  const [deletingMovement, setDeletingMovement] = useState<Movement | null>(null)
  const [hiddenColumns, setHiddenColumns] = useState<Set<PaymentColumnKey>>(() => new Set(['mode']))
  const [columnsOpen, setColumnsOpen] = useState(false)

  const toggleColumn = (key: PaymentColumnKey): void =>
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })

  return (
    <Stack spacing={4} component="section" aria-label="Pagos y servicios">
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 3,
          backgroundColor: organicColors.orange.tint
        }}
        elevation={0}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            flexShrink: 0,
            backgroundColor: '#f8dcca',
            color: organicColors.orange.dark
          }}
        >
          <AccountBalanceWalletIcon />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Total de los pagos filtrados
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: organicTypography.titleFontFamily,
              fontSize: '1.75rem',
              color: organicColors.orange.dark
            }}
          >
            {formatCurrency(totalAmount)}
          </Typography>
        </Box>
      </Card>

      <Stack direction="row" spacing={1.5} alignItems="flex-end" flexWrap="wrap" useFlexGap>
        <TextField
          label="Ordenar por"
          select
          size="small"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as PaymentSortBy)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value={PaymentSortBy.DATE}>Fecha</MenuItem>
          <MenuItem value={PaymentSortBy.AMOUNT}>Monto</MenuItem>
        </TextField>
        <TextField
          label="Estado"
          select
          size="small"
          value={activeFilter}
          onChange={(event) => setActiveFilter(event.target.value as PaymentFilter)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value={PaymentFilter.PENDING}>Pendientes</MenuItem>
          <MenuItem value={PaymentFilter.PAID}>Pagados</MenuItem>
          <MenuItem value={PaymentFilter.ALL}>Todos</MenuItem>
        </TextField>
        <TextField
          label="Método de pago"
          select
          size="small"
          value={methodFilter}
          onChange={(event) => setMethodFilter(event.target.value as PaymentMethodFilter)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value={PaymentMethodFilter.ALL}>Todos los métodos</MenuItem>
          <MenuItem value={PaymentMethodFilter.CASH}>Efectivo</MenuItem>
          <MenuItem value={PaymentMethodFilter.CREDIT_CARD}>Tarjeta</MenuItem>
        </TextField>
        <TextField
          label="Tipo de pago"
          select
          size="small"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as PaymentTypeFilter)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value={PaymentTypeFilter.ALL}>Todos</MenuItem>
          <MenuItem value={PaymentTypeFilter.RECURRING}>Recurrente</MenuItem>
          <MenuItem value={PaymentTypeFilter.ONE_OFF}>Único</MenuItem>
        </TextField>
        <TextField
          label="Cuenta"
          select
          size="small"
          value={accountFilter}
          onChange={(event) => setAccountFilter(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value={ALL}>Todas las cuentas</MenuItem>
          {accountOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Categoría"
          select
          size="small"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value={ALL}>Todas las categorías</MenuItem>
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="De quién es"
          select
          size="small"
          value={ownerFilter}
          onChange={(event) => setOwnerFilter(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value={ALL}>Todos</MenuItem>
          {ownerOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ position: 'relative', ml: 'auto' }}>
          <Button
            size="small"
            startIcon={<TuneIcon />}
            onClick={() => setColumnsOpen((prev) => !prev)}
            sx={{ color: 'text.secondary' }}
          >
            Columnas{' '}
            <Box component="span" sx={{ ml: 0.5, color: organicColors.neutral.textSecondary }}>
              {COLUMN_TOGGLES.length - hiddenColumns.size}
            </Box>
          </Button>
          {columnsOpen && (
            <ClickAwayListener onClickAway={() => setColumnsOpen(false)}>
              <Card
                elevation={3}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  zIndex: 20,
                  minWidth: 220,
                  p: 1
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                  Columnas visibles
                </Typography>
                <Stack>
                  {COLUMN_TOGGLES.map((column) => (
                    <FormControlLabel
                      key={column.key}
                      sx={{ mx: 0 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={!hiddenColumns.has(column.key)}
                          onChange={() => toggleColumn(column.key)}
                        />
                      }
                      label={<Typography variant="body2">{column.label}</Typography>}
                    />
                  ))}
                </Stack>
              </Card>
            </ClickAwayListener>
          )}
        </Box>
      </Stack>

      {filteredEntries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay pagos para mostrar acá.
        </Typography>
      ) : (
        <PaymentsTable
          entries={filteredEntries}
          focusEntryId={focusEntryId}
          hiddenColumns={hiddenColumns}
          onEditPayment={setEditingPayment}
          onDeletePayment={setDeletingPayment}
          onEditMovement={setEditingMovement}
          onDeleteMovement={setDeletingMovement}
        />
      )}

      {editingPayment && (
        <EditPaymentDialog
          payment={editingPayment}
          open={Boolean(editingPayment)}
          onClose={() => setEditingPayment(null)}
        />
      )}
      {deletingPayment && (
        <DeletePaymentDialog
          payment={deletingPayment}
          open={Boolean(deletingPayment)}
          onClose={() => setDeletingPayment(null)}
          onDeleted={() => setDeletingPayment(null)}
        />
      )}
      {editingMovement && (
        <EditMovementDialog
          movement={editingMovement}
          open={Boolean(editingMovement)}
          onClose={() => setEditingMovement(null)}
        />
      )}
      {deletingMovement && (
        <DeleteMovementDialog
          movement={deletingMovement}
          open={Boolean(deletingMovement)}
          onClose={() => setDeletingMovement(null)}
        />
      )}
    </Stack>
  )
}
