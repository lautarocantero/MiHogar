import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { organicColors } from '@/theme/tokens'
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
import type { PaymentView } from './typings/types'

const ALL = 'ALL'

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

  return (
    <Stack spacing={4} component="section" aria-label="Pagos y servicios">
      <Card sx={{ p: 3, backgroundColor: organicColors.orange.tint }} elevation={0}>
        <Typography variant="body1" color="text.secondary">
          Total de los pagos filtrados
        </Typography>
        <Typography variant="h3" component="p" color={organicColors.orange.dark}>
          {formatCurrency(totalAmount)}
        </Typography>
      </Card>

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
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
      </Stack>

      {filteredEntries.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay pagos para mostrar acá.
        </Typography>
      ) : (
        <PaymentsTable
          entries={filteredEntries}
          focusEntryId={focusEntryId}
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
