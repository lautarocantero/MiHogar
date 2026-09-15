# Auditoría: funcionalidad CRUD faltante

## 1. Resumen ejecutivo

Mi Hogar guarda todos sus datos en Redux (hidratado desde un vault JSON cifrado local,
sin backend). Un relevamiento del código encontró un **patrón sistemático**: casi cada
slice de Redux (`accountsSlice`, `movementsSlice`, `paymentsSlice`, `savingsSlice`,
`membersSlice`, `categoriesSlice`) fue construido con reducers `add/update/remove`
completos vía `createEntityAdapter` de Redux Toolkit — pero la capa de UI **solo cablea
Create y Read**. En la práctica, casi nada de lo que se carga en la app se puede corregir
ni borrar después, salvo excepciones puntuales (estado de un pago, credenciales de un
pago, adjuntos).

Este documento lista cada gap encontrado, con prioridad sugerida y estado. Los primeros
tres (cuentas, movimientos, selector de integrante) se implementan en la rama
`001-feature/solve-details`; el resto queda documentado para una próxima sesión.

## 2. Metodología

Relevamiento manual archivo por archivo (componentes de cada módulo en `src/modules/*`,
slices en `src/store/*`, schemas de validación en `src/validation/*`), complementado con
búsquedas (`grep`) para confirmar si cada reducer `update*`/`remove*` tiene algún
`dispatch` real en algún componente, o si quedó sin usar. Un "gap" acá significa: existe
el mecanismo de datos (reducer, tipo, selector) pero no hay ningún botón/diálogo/flujo de
UI que lo dispare.

## 3. Tabla de prioridades

| Entidad | Gap | Impacto | Esfuerzo | Prioridad | Estado |
|---|---|---|---|---|---|
| Cuentas | Sin editar ni eliminar | Alto — es de las pantallas más usadas | Medio | Alta | Implementado esta sesión |
| Movimientos (gastos) | Sin editar ni eliminar | Alto — errores de carga son inevitables | Alto (efecto en saldos) | Alta | Implementado esta sesión |
| Selector de integrante | Dropdown vacío sin alta inline | Alto — bloquea el alta de cuentas/pagos/ahorros por integrante | Bajo | Alta | Implementado esta sesión |
| Pagos | Sin edición general (concepto/monto/vencimiento/entidad/categoría), sin eliminar | Medio-Alto | Medio | Alta | Pendiente |
| Ahorros | Sin editar ni eliminar | Medio | Bajo-Medio | Media | Pendiente |
| Integrantes del hogar | Sin editar ni eliminar | Medio | Bajo | Media | Pendiente |
| Nombre del hogar | Sin UI para renombrar | Bajo | Bajo | Baja | Pendiente |
| Categorías | Sin alta/edición/borrado — solo existen las sembradas al crear el hogar | Medio-Alto — categorías fijas para siempre | Medio | Alta | Pendiente |
| Adjuntos de pagos | — | — | — | Ya completo (caso de control) |

## 4. Cuentas (Accounts) — implementado esta sesión

- Slice: `src/store/accounts/accountsSlice.ts` — `updateAccount`/`removeAccount` existían
  pero `updateAccount` solo se usaba internamente desde
  `src/store/movements/movementThunks.ts` para ajustar el saldo tras un movimiento, nunca
  para editar los datos de la cuenta. `removeAccount` no se usaba en ningún lado.
- UI: `src/modules/accounts/components/AccountCard.tsx` era una tarjeta puramente
  visual, sin `onClick` ni menú.
- Fix: se agregó edición (nombre, tipo, dueño, saldo, frase de contexto, datos de
  tarjeta) y borrado (con aviso no bloqueante de movimientos/pagos asociados) desde un
  menú en `AccountCard`.

## 5. Movimientos / gastos — implementado esta sesión

- Slice: `src/store/movements/movementsSlice.ts` — `updateMovement`/`removeMovement`
  nunca se despachaban desde ningún componente.
- UI: `src/modules/timeline/components/TimelineEntryCard.tsx` era de solo lectura.
- Complejidad: `recordMovementThunk` (`src/store/movements/movementThunks.ts`) ajusta el
  saldo de la(s) cuenta(s) involucradas cuando el movimiento es de hoy o pasado. Editar o
  borrar un movimiento tiene que revertir/reaplicar ese efecto correctamente (cambios de
  fecha, cuenta, tipo o monto).
- Fix: se agregó edición y borrado desde un menú en `TimelineEntryCard`, con thunks
  dedicados (`updateMovementThunk`/`removeMovementThunk`) que revierten el efecto viejo y
  aplican el nuevo. Los movimientos generados automáticamente al marcar un pago como
  pagado (`movement.paymentId` seteado) no son editables/eliminables desde acá todavía —
  ver sección 7.

## 6. Selector de integrante ("¿De quién es?") — implementado esta sesión

- Bug reportado por el usuario: en `src/modules/accounts/components/AddAccountForm.tsx`,
  al elegir "De un integrante" el select "Integrante" se llena solo con
  `selectAllMembers` — si el hogar no tiene integrantes cargados, el select queda vacío,
  sin salida. El mismo patrón estaba duplicado en
  `src/modules/payments/components/AddPaymentForm.tsx` y
  `src/modules/savings/components/AddSavingsForm.tsx`.
- Fix: nuevo componente compartido `src/components/shared/MemberOwnerField.tsx` que
  agrega una opción "+ Agregar integrante" al final del select; al elegirla abre el
  diálogo de alta de integrante existente (`AddMemberDialog`) inline y selecciona
  automáticamente al integrante recién creado.

## 7. Pagos (Payments) — pendiente

- Slice: `src/store/payments/paymentsSlice.ts` — `updatePayment` solo se usa para casos
  angostos: `src/modules/payments/hooks/useMarkPaymentAsPaid.ts` (cambiar estado) y
  `src/modules/payments/hooks/useUpdateCredentials.ts` (credenciales). No existe edición
  general de concepto, monto, entidad, vencimiento, categoría o cuenta. `removePayment`
  nunca se despacha — no hay forma de eliminar un pago/servicio cargado por error.
- Relacionado: los movimientos que un pago genera al marcarse como pagado
  (`movement.paymentId`) no se pueden editar/eliminar desde Movimientos sin desincronizar
  el estado del pago — falta diseñar la reconciliación (por ejemplo, si se borra ese
  movimiento, el pago debería volver a "pendiente").

## 8. Ahorros (Savings instruments) — pendiente

- Slice: `src/store/savings/savingsSlice.ts` — `updateSavingsInstrument`/
  `removeSavingsInstrument` sin usar. `src/modules/savings/components/SavingsInstrumentRow.tsx`
  es de solo lectura. Mismo patrón que cuentas: se puede reusar el mismo enfoque
  (extraer campos a un `SavingsFormFields`, agregar Edit/Delete dialogs y un menú en la fila).

## 9. Integrantes del hogar (Household members) — pendiente

- Slice: `src/store/household/membersSlice.ts` — `updateMember`/`removeMember` sin usar.
  `src/modules/settings/components/MembersList.tsx` es de solo lectura (solo "Agregar").
- Ojo: borrar un integrante que sea dueño de cuentas/pagos/ahorros deja esas referencias
  huérfanas — mismo criterio de "avisar sin bloquear" que se usó para cuentas serviría acá.

## 10. Nombre del hogar (Household rename) — pendiente

- `setHouseholdName` existe en `src/store/household/householdSlice.ts:12` pero ningún
  componente lo despacha. Falta un campo editable en Ajustes (`SettingsPage.tsx`).

## 11. Categorías (Categories) — pendiente

- No existe ninguna UI de alta, edición ni borrado de categorías en toda la app. Las
  únicas categorías que existen son las sembradas una sola vez al crear el hogar, vía
  `buildDefaultCategories` (usado en `src/store/vault/vaultThunks.ts`). Si esas
  categorías no alcanzan, el usuario no tiene forma de agregar una nueva — impacta
  directamente la carga de gastos y pagos (los selects de categoría en
  `StepAmountAndDetails.tsx` y `AddPaymentForm.tsx` dependen 100% de ese set fijo).
  Este es probablemente el gap de mayor impacto después de los tres ya resueltos.

## 12. Adjuntos de pagos — caso de control

- `src/modules/payments/hooks/useAttachments.ts` ya tiene alta, lectura y borrado
  (`uploadFile`/`openFile`/`removeFile`) completamente funcionales. Se incluye acá solo
  como contraste: confirma que el patrón "dialog → form → hook" que se usa para llenar
  los gaps de arriba ya es el patrón establecido en la app cuando el CRUD está completo.

## 13. Inconsistencias menores detectadas

- `src/validation/addMemberFormSchema.ts` usa **yup**, mientras el resto de los schemas
  de la app usan **zod** (`@hookform/resolvers/zod`). No bloquea nada, pero vale
  unificarlo si se toca ese formulario en el futuro.

## 14. Próximos pasos sugeridos

1. Categorías: alta/edición/borrado (impacto alto, esfuerzo medio).
2. Pagos: edición general + borrado, y reconciliación con movimientos generados al pagar.
3. Ahorros: edición y borrado (mismo patrón ya aplicado a cuentas).
4. Integrantes del hogar: edición y borrado, con aviso de referencias huérfanas.
5. Nombre del hogar: campo editable en Ajustes.
