import { useState } from 'react'
import { Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { organicColors } from '@/theme/tokens'
import { formatCurrency } from '@/utils/formatting/formatCurrency'
import { PaymentKind } from '@/typings/domain/enums'
import { PaymentFilterPills } from './components/PaymentFilterPills'
import { PaymentMethodPills } from './components/PaymentMethodPills'
import { PaymentRow } from './components/PaymentRow'
import { AddPaymentDialog } from './components/AddPaymentDialog'
import { EditPaymentDialog } from './components/EditPaymentDialog'
import { DeletePaymentDialog } from './components/DeletePaymentDialog'
import { usePaymentFilters } from './hooks/usePaymentFilters'
import { PaymentSortBy } from './typings/enums'
import type { PaymentView } from './typings/types'

export function PaymentsListPage(): React.JSX.Element {
  const {
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    methodFilter,
    setMethodFilter,
    filteredPayments,
    pendingCount,
    paidCount,
    totalCount,
    totalAmount
  } = usePaymentFilters()
  const [addPaymentKind, setAddPaymentKind] = useState<PaymentKind | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentView | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<PaymentView | null>(null)

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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
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
          <PaymentFilterPills
            activeFilter={activeFilter}
            pendingCount={pendingCount}
            paidCount={paidCount}
            totalCount={totalCount}
            onChange={setActiveFilter}
          />
          <PaymentMethodPills activeMethod={methodFilter} onChange={setMethodFilter} />
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setAddPaymentKind(PaymentKind.EXPENSE)}
          >
            Agregar un pago fijo
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setAddPaymentKind(PaymentKind.DEPOSIT)}
          >
            Agregar un depósito fijo
          </Button>
        </Stack>
      </Stack>

      {filteredPayments.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay pagos para mostrar acá.
        </Typography>
      ) : (
        <Stack spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {filteredPayments.map((payment) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              onEdit={() => setEditingPayment(payment)}
              onDelete={() => setDeletingPayment(payment)}
            />
          ))}
        </Stack>
      )}

      {addPaymentKind && (
        <AddPaymentDialog
          kind={addPaymentKind}
          open={Boolean(addPaymentKind)}
          onClose={() => setAddPaymentKind(null)}
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
    </Stack>
  )
}
