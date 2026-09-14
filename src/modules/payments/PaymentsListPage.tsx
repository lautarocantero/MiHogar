import { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { PaymentFilterPills } from './components/PaymentFilterPills'
import { PaymentRow } from './components/PaymentRow'
import { AddPaymentDialog } from './components/AddPaymentDialog'
import { usePaymentFilters } from './hooks/usePaymentFilters'

export function PaymentsListPage(): React.JSX.Element {
  const { activeFilter, setActiveFilter, filteredPayments, pendingCount, paidCount, totalCount } =
    usePaymentFilters()
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)

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
            <PaymentRow key={payment.id} payment={payment} />
          ))}
        </Stack>
      )}

      <AddPaymentDialog open={isAddPaymentOpen} onClose={() => setIsAddPaymentOpen(false)} />
    </Stack>
  )
}
