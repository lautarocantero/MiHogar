# Data Model: Carga de boletas

## 1. `Movement` (existente, `src/validation/movementSchema.ts:4-17`) — campo nuevo

```ts
export const movementSchema = z.object({
  // ...campos existentes sin cambios...
  isImported: z.boolean().optional() // NUEVO
})
```

- Opcional para no romper vaults existentes al recargar (`Movement`s ya guardados sin el campo).
- `true` únicamente en movimientos creados por este flujo; nunca se le saca a un movimiento
  importado, ni siquiera al editarlo (spec §3 paso 7, Supuesto 8/12).
- `removeMovementThunk`/`updateMovementThunk` (`src/store/movements/movementThunks.ts:83-115`)
  saltean `applyMovementBalanceEffect` cuando `movement.isImported === true`; `updateMovementThunk`
  fuerza `isImported` desde `oldMovement` al armar `newMovement`, sin confiar en
  `input.changes.isImported` (spec Supuesto 12).

## 2. Fila parseada (nueva) — `src/validation/importedRowSchema.ts`

Sale del parser (main process, vía IPC) antes de llegar a la previsualización. Validación de
estructura (Principio II), no de negocio.

```ts
export const parsedStatementRowSchema = z.object({
  date: z.string().refine(isValidCalendarDate, 'Fecha inválida'), // yyyy-MM-dd, ya normalizada
  // por el parser (MP: dd-mm-yyyy
  // → yyyy-MM-dd; Galicia: dd-mm-aa
  // con año interpretado 20aa)
  amount: z
    .number()
    .finite()
    .refine((n) => n !== 0, 'Monto no puede ser 0'),
  description: z.string().min(1),
  sourceRef: z.string().optional() // ID de operación (MP) o comprobante (Galicia), sólo para debug/log
})

export type ParsedStatementRow = z.infer<typeof parsedStatementRowSchema>
```

`isValidCalendarDate`: valida que el string matchee `yyyy-MM-dd` **y** que sea una fecha real de
calendario (mes 01-12, día válido para ese mes/año — no sólo forma, ver spec v13 pulido 1). Usar
`date-fns` `isValid(parseISO(value))` (ya es dependencia del proyecto).

**Signo → dirección**: el signo de `amount` en la fila parseada conserva la convención de la
fuente (positivo/negativo tal como viene del archivo, sin normalizar todavía a `Math.abs`) — la
conversión a `type` + valor absoluto ocurre en el mapeo a fila confirmada (§3), porque la regla
de signo→tipo difiere entre MP/cuenta común (positivo→`INCOME`) y Galicia/tarjeta
(positivo→`EXPENSE`, ver spec §3 paso 6).

Filas cuyo monto está en la columna `DÓLARES` (Galicia) nunca llegan a este schema — se filtran
en el parser mismo, antes del schema (Supuesto 5 del spec).

## 3. Fila confirmada (nueva) — mismo archivo, schema derivado

Corre justo antes del `dispatch`, en `useImportMovements`, sobre las filas que el usuario dejó
incluidas en la previsualización (spec §4, pulido v13).

```ts
export const confirmedStatementRowSchema = parsedStatementRowSchema.extend({
  categoryId: z.string().min(1), // obligatorio acá (spec Supuesto 4) — no en la fila parseada
  accountId: z.string().min(1), // cuenta elegida por el usuario en el paso 2
  type: z.nativeEnum(MovementType), // ya resuelto por la regla de signo→tipo de la fuente
  ownerType: z.nativeEnum(OwnerType), // heredado de la cuenta (Supuesto 11)
  ownerId: z.string().optional()
})

export type ConfirmedStatementRow = z.infer<typeof confirmedStatementRowSchema>
```

## 4. Mapeo fila confirmada → `Movement`

En `useImportMovements`, por cada `ConfirmedStatementRow`:

| Campo `Movement`      | Origen                                                           |
| --------------------- | ---------------------------------------------------------------- |
| `id`                  | `uuidv4()` (mismo patrón que `attachmentHandlers.ts:9`)          |
| `type`                | de la fila confirmada (ver regla de signo, §2 de este documento) |
| `amount`              | `Math.abs(row.amount)`                                           |
| `date`                | `row.date` (ya `yyyy-MM-dd`)                                     |
| `accountId`           | `row.accountId`                                                  |
| `categoryId`          | `row.categoryId`                                                 |
| `ownerType`/`ownerId` | `row.ownerType`/`row.ownerId` (heredados de la cuenta)           |
| `isImported`          | `true`                                                           |
| `note`                | `row.description` (texto original del archivo, sin editar)       |

Se arma el array completo y se hace **un solo** `dispatch(addManyMovements(rows))`
(`movementsAdapter.addMany`, spec Supuesto 7) — no un `createAsyncThunk`.

## 5. Estructura real medida de cada fuente (confirma Supuesto 1 del spec, v9-v13)

### Mercado Pago (PDF)

Tabla de una sola sección: `Fecha (dd-mm-yyyy) | Descripción | ID de la operación | Valor ($ con
signo) | Saldo`. Incluye filas de "Rendimientos" diarios (montos chicos) además de
transferencias/débitos. Signo del archivo = signo de `type` (positivo → `INCOME`, negativo →
`EXPENSE`).

### Banco Galicia — tarjeta de crédito (PDF)

No es una tabla única:

- Sección `DETALLE DEL CONSUMO`, repetida por titular/adicional: `FECHA (dd-mm-aa) | REFERENCIA
| CUOTA (opcional, "NN/NN") | COMPROBANTE | PESOS | DÓLARES`. Todas las filas de consumo
  vienen en positivo en su columna de moneda.
- Líneas sueltas (saldo anterior, pago recibido, impuestos, intereses, percepciones IIBB): fecha
  - descripción + monto, sin `CUOTA` ni `COMPROBANTE`. Pagos vienen en negativo; el resto
    (impuestos/intereses/saldo anterior) en positivo.
- Regla de signo→tipo (confirmada, spec §3 paso 6): positivo → `EXPENSE`, negativo → `INCOME`
  (al revés que MP, porque el resumen de tarjeta mide deuda, no saldo disponible).
- Filas en dólares: se descartan en el parser, no llegan al schema de fila parseada.

### Diferido — sin archivo real todavía (no bloquea este plan, ver spec §5/§6/§8)

- Excel/CSV de Mercado Pago y de Banco Galicia (cualquier tipo de cuenta).
- PDF de Banco Galicia cuenta común/billetera (el único PDF medido es de tarjeta).

Los parsers para estos casos se implementan con la mejor suposición documentada en el spec
(§5 Supuesto 1), pero **no** tienen AC verificable hasta conseguir un archivo real — `tasks.md`
debe marcarlos explícitamente como diferidos/no bloqueantes para el resto de la feature.
