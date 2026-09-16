import { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { PaymentKind } from '@/typings/domain/enums'
import { PaymentFilterPills } from './components/PaymentFilterPills'
import { PaymentRow } from './components/PaymentRow'
import { AddPaymentDialog } from './components/AddPaymentDialog'
import { EditPaymentDialog } from './components/EditPaymentDialog'
import { DeletePaymentDialog } from './components/DeletePaymentDialog'
import { usePaymentFilters } from './hooks/usePaymentFilters'
import type { PaymentView } from './typings/types'

export function PaymentsListPage(): React.JSX.Element {
  const { activeFilter, setActiveFilter, filteredPayments, pendingCount, paidCount, totalCount } =
    usePaymentFilters()
  const [addPaymentKind, setAddPaymentKind] = useState<PaymentKind | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentView | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<PaymentView | null>(null)

  return (
    <Stack spacing={4} component="section" aria-label="Pagos y servicios">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <PaymentFilterPills
          activeFilter={activeFilter}
          pendingCount={pendingCount}
          paidCount={paidCount}
          totalCount={totalCount}
          onChange={setActiveFilter}
        />
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
