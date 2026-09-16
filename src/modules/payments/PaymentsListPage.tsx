import { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
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
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
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
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setIsAddPaymentOpen(true)}
        >
          Agregar un pago
        </Button>
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

      <AddPaymentDialog open={isAddPaymentOpen} onClose={() => setIsAddPaymentOpen(false)} />
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
