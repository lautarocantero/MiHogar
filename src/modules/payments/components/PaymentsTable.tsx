import { useEffect, useRef } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { PaymentTableRow } from './PaymentTableRow'
import type { PaymentsTableProps } from '../typings/props'

export function PaymentsTable({
  entries,
  focusEntryId,
  onEditPayment,
  onDeletePayment,
  onEditMovement,
  onDeleteMovement
}: PaymentsTableProps): React.JSX.Element {
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>())

  useEffect(() => {
    if (!focusEntryId) return
    rowRefs.current.get(focusEntryId)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [focusEntryId, entries])

  return (
    <TableContainer component={Card} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Método de pago</TableCell>
            <TableCell>Tipo de pago</TableCell>
            <TableCell>Cuenta</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>De quién es</TableCell>
            <TableCell>Monto fijo/variable</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <PaymentTableRow
              key={entry.id}
              entry={entry}
              isFocused={entry.id === focusEntryId}
              rowRef={(node) => {
                if (node) {
                  rowRefs.current.set(entry.id, node)
                } else {
                  rowRefs.current.delete(entry.id)
                }
              }}
              onEditPayment={onEditPayment}
              onDeletePayment={onDeletePayment}
              onEditMovement={onEditMovement}
              onDeleteMovement={onDeleteMovement}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
