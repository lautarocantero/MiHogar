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
import { organicColors } from '@/theme/tokens'
import { PaymentTableRow } from './PaymentTableRow'
import type { PaymentColumnKey, PaymentsTableProps } from '../typings/props'

const HEADERS: Array<{ key: PaymentColumnKey; label: string }> = [
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

export function PaymentsTable({
  entries,
  focusEntryId,
  hiddenColumns,
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
    <TableContainer
      component={Card}
      elevation={0}
      sx={{ border: `1px solid ${organicColors.brown.main}` }}
    >
      <Table
        size="small"
        sx={{
          borderCollapse: 'collapse',
          '& .MuiTableCell-root': {
            border: `1px solid ${organicColors.brown.main}`
          }
        }}
      >
        <TableHead>
          <TableRow>
            {HEADERS.filter((header) => !hiddenColumns.has(header.key)).map((header) => (
              <TableCell
                key={header.key}
                sx={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  color: '#fffdf9',
                  backgroundColor: organicColors.brown.main,
                  whiteSpace: 'nowrap'
                }}
              >
                {header.label}
              </TableCell>
            ))}
            <TableCell
              align="right"
              sx={{ backgroundColor: organicColors.brown.main, color: '#fffdf9', fontWeight: 600 }}
            >
              Monto
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: organicColors.brown.main, color: '#fffdf9', fontWeight: 600 }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <PaymentTableRow
              key={entry.id}
              entry={entry}
              isFocused={entry.id === focusEntryId}
              hiddenColumns={hiddenColumns}
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
