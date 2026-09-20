# Pendientes

Bugs y cosas por agregar a la aplicación.

## Bugs

- Cancelar un pago ya pagado no revierte `installmentsPaid`: se paga cuota 2/3, se cancela, y queda mostrando "cuota 3/3" en vez de 2/3 (`src/modules/payments/hooks/useCancelPayment.ts:17`).
- Fecha de cierre/vencimiento de tarjeta rota para días 29-31: no se clampea al último día del mes, así que una tarjeta con cierre día 31 evaluada en febrero calcula la fecha en marzo (`src/utils/domain/computeNextClosingDate.ts:4`, `src/utils/domain/computeNextDueDate.ts:3`).
- Pago parcial de tarjeta puede sobregirar la cuenta origen: si se paga más de lo que se debe, la deuda se clampea a 0 pero a la cuenta pagadora le descuentan el monto completo igual (`src/modules/quickAdd/steps/StepCardPaymentDetails.tsx:77`).
- Borrar una cuenta deja referencias colgantes: no reasigna ni limpia `accountId`/`sourceAccountId` en pagos, movimientos y tarjetas que apuntaban a esa cuenta; esos registros quedan huérfanos y desaparecen de las vistas agregadas sin avisar (`src/modules/accounts/useDeleteAccount.ts:12`).
- Se aceptan montos negativos en Quick Add: la validación solo rechaza 0/vacío, no negativos, así que cargar "-500" corrompe los balances (`src/modules/quickAdd/steps/StepAmountAndDetails.tsx:116`, `src/modules/quickAdd/steps/StepIncomeDetails.tsx:67`).
- Separador decimal roto para formato es-AR: el campo de monto es `type="number"` nativo (solo acepta `.`), pero la app muestra moneda con `,` como decimal. Escribir "1.500" pensando en mil quinientos guarda 1.5 (mil veces menos) (`src/components/shared/NumberField.tsx`, `src/utils/formatting/formatCurrency.ts:2`).
- Proyección "Mes calendario completo" duplica ingresos ya recibidos: vuelve a sumar ingresos del mes que ya están incluidos en el balance actual de la cuenta, sobreestimando el saldo de fin de mes (`src/modules/projection/useProjectionData.ts:24`).
- Pagos/depósitos que vencen "hoy" desaparecen de la proyección "desde hoy": compara la hora actual contra la fecha de vencimiento parseada a medianoche, así que un pago con vencimiento hoy queda excluido casi todo el día (`src/modules/projection/useProjectionData.ts:24`).
- Calendario: `selectedDate` no se resetea al cambiar de mes, así que el panel de detalle/timeline puede quedar apuntando a una fecha que no existe en el mes nuevo y mostrar "sin movimientos" aunque los haya (`src/modules/calendar/CalendarPage.tsx:205`).
- Calendario: el auto-scroll al próximo evento solo funciona la primera vez que se abre; no se resetea al cambiar de mes (`src/modules/calendar/CalendarPage.tsx:209`).
- Categorías: se puede crear una categoría con nombre en blanco (solo espacios), porque la validación no hace `.trim()` (`src/validation/addCategoryFormSchema.ts:3`).
- Router: no hay ruta 404 (`path="*"`); un hash inválido deja el área de contenido en blanco (`src/router/AppRouter.tsx:47`).
- Deudas: la tasa de interés (`rateAnnual`) es solo decorativa, nunca se usa para calcular el saldo; una deuda con interés baja más rápido de lo real (no se acumula interés) (`src/modules/debts/useRegisterInstallmentPayment.ts:15`).

## Por agregar

- Opción de no pagar totalmente los montos (pago parcial).
- Mejorar formularios.
- Agregar dólares.
- Agregar consejos.
- Opción de cuánto te ahorrarías sin un ítem.
- Carga de boletas.
- En tarjeta: mostrar cantidad a disposición y cantidad a ahorrar.
- Separar cuentas de tarjetas.
- Mejorar tabla.
- Agregar menú de tres puntos para acciones.
- Agregar temas (theming).
- Acomodar notificaciones.
- Agregar actualizaciones automáticas.
- Agregar radio button de Moneda (Pesos/Dólares) en movimientos de pago/recepción y en cuentas.
- Formulario propio para "Recibí dinero" (monto, método de pago sin tarjeta, moneda, concepto, nota, cuenta destino, fecha), separado del formulario de gasto.
- Adaptar a tamaño tablet.
- Implementar Google Calendar.
- Hacer landing page.
- Subir a portafolio personal.
- Notificación de hace cuánto tiempo no se sube un nuevo registro.
