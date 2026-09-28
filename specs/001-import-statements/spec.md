---
feature: 001-import-statements
pendiente: 'Carga de boletas. (docs/pending.md:28)'
rama: 001-feature/import-statements
fecha: 2026-09-27
estado: aprobado
---

## Historial de revisiones

- **v1** (2026-09-27): versión inicial. Veredicto `/spec-review`: **BLOCKED**
  (`spec-review.md`) — cita rota en `movementsSlice.ts:26`, referencia a un componente
  inexistente (`TimelinePage`), y el Supuesto 7 (batching de guardados) contradecía cómo
  dispara guardados `persistenceMiddleware` en la realidad.
- **v2** (2026-09-27): corrige las tres cosas bloqueantes y una decisión de producto que
  quedó como NEEDS-DECISION en la v1 (¿los movimientos importados afectan el saldo actual de
  la cuenta?). Cambios: (a) se decide que la importación **no aplica efecto de saldo**
  (ni `balance` ni `usedAmount`) — son registro histórico puro, lo que además simplifica el
  guardado del vault a una sola acción por importación; (b) se agrega el reducer nuevo que
  hace falta para eso (`addManyMovements`) en vez de reusar `recordMovementThunk`; (c) se
  corrige la cita de `movementsSlice.ts` a la línea real; (d) se reemplaza toda referencia a
  `TimelinePage` (no existe) por `PaymentsListPage`, donde de hecho se renderiza
  `EditMovementDialog`; (e) se agrega de dónde sale `ownerType`/`ownerId` en un movimiento
  importado; (f) se agrega un schema Zod para las filas parseadas; (g) se agregan AC para PDF
  y para Banco Galicia como fuente. Veredicto: **BLOCKED** de nuevo — el "thunk nuevo" que
  proponía (b) seguía el patrón `createAsyncThunk` de `movementThunks.ts`, que dispara
  acciones `.../pending` y `.../fulfilled` además de la de negocio; `persistenceMiddleware`
  las cuenta igual (cualquier tipo que empiece con `movements/`), así que en vez de 1
  guardado por importación seguían siendo 3.
- **v3** (2026-09-27): corrige eso. (a) se reemplaza el "thunk nuevo" por un hook plano
  (`useImportMovements`) que dispatchea `addManyMovements` directo, sin `createAsyncThunk` —
  mismo patrón que ya usan `useCreatePayment`/`useDeletePayment`
  (`src/modules/payments/useCreatePayment.ts:10-46`) para acciones puntuales del slice; así
  sólo hay **un** tipo de acción (`movements/addManyMovements`), no tres. (b) se fija que
  `amount` se guarda como valor absoluto (igual que un movimiento cargado a mano,
  `quickAddFormSchema.ts:11`), y `type` es lo que codifica la dirección. (c) se aclara que la
  comparación de fecha en el chequeo de duplicados es sobre `yyyy-MM-dd` sin hora (mismo
  formato que ya usa todo el dominio, `demoVaultData.ts:36-38`), para que dos exportaciones
  del mismo día no fallen la comparación por diferencias de hora. Veredicto:
  **NEEDS-DECISION** — sin críticos, pero encontró que borrar (o cambiarle tipo/cuenta a) un
  movimiento importado pasaba por `removeMovementThunk`/`updateMovementThunk`, que revierten
  un efecto de saldo que la importación nunca aplicó, inflando el saldo.
- **v4** (2026-09-27): resuelve esa decisión — el usuario eligió marcar los movimientos
  importados en vez de aceptar el límite. Cambios: (a) se agrega `isImported` (opcional) a
  `movementSchema.ts`, revirtiendo lo que decía el Supuesto 8 de la v1-v3; (b)
  `removeMovementThunk`/`updateMovementThunk` deben chequear ese flag antes de llamar
  `applyMovementBalanceEffect`, para no revertir un efecto que nunca se aplicó; (c) se agrega
  la sección "Constitution Check" que exige la constitución (`constitution.md:106-107`) y que
  faltaba; (d) se ajusta el schema de filas parseadas a `yyyy-MM-dd` estricto, no ISO
  genérico; (e) se aclara que la previsualización no depende de `react-hook-form` (mismo
  precedente que `CategoryField`, ya usado con estado plano); (f) se corrige una cita
  imprecisa (`attachmentsStorage.ts:19-33`). Veredicto: **BLOCKED** de nuevo — dos críticos:
  `isImported` se pierde en la primera edición porque `useUpdateMovement.ts:20-35` arma
  `changes` campo por campo y no lo incluye (sólo copia `ownerType`/`ownerId`/`paymentId` del
  movimiento viejo), y el AC de "un solo guardado" pedía verificarlo con Redux DevTools, que no
  está instalado en el proyecto (no hay `electron-devtools-installer` ni
  `session.loadExtension`).
- **v5** (2026-09-27): corrige ambos. (a) en vez de confiar en que cada hook que llama
  `updateMovementThunk` se acuerde de reenviar `isImported` (el mismo patrón que ya falla
  hoy silenciosamente para cualquier campo no enumerado a mano), el thunk mismo fuerza
  `isImported` desde `oldMovement`, ignorando lo que venga en `input.changes` — un solo punto
  de control en vez de uno por cada lugar que llama al thunk; (b) el AC de guardado único se
  reescribe para verificarse con las DevTools de Chromium (built-in en toda ventana de
  Electron, no la extensión de Redux) y un `console.log` temporal, en vez de una herramienta
  que no está instalada. Veredicto: **BLOCKED** — un crítico de cita: decía que
  `UpdateMovementInput` hace opcionales _todos_ sus campos (`movementThunks.ts:12`), y en
  realidad sólo `changes.isImported` es opcional (por venir de `Movement.isImported`, que sí
  se declara `.optional()`); el resto de `changes` es obligatorio. La conclusión del diseño no
  cambiaba, pero la cita no respaldaba la frase tal como estaba escrita.
- **v6** (2026-09-27): corrige la redacción de esa cita (§5 Supuesto 12, §8 KNOWN) y de paso
  dos "Importante" que señaló la misma ronda: (a) el AC del `console.log` ahora dice
  explícitamente dónde ponerlo (después del guard de `isMutatingAction`, no adentro — para no
  loguear acciones que ni llegan a evaluarse para guardar) y qué contar (una sola línea
  `movements/addManyMovements`); (b) el Constitution Check aclara que el precedente para no
  usar `react-hook-form` en la previsualización (Supuesto 13) es en sí un desvío ya existente
  del Principio II, no un patrón sancionado por la constitución — se acepta por el alcance
  acotado de lo editable ahí (categoría + checkbox). Veredicto: **NEEDS-DECISION** — sin
  críticos, pero encontró que una fila importada sin categoría (permitida por el Supuesto 4)
  después no se puede editar desde `EditMovementForm`, porque ese formulario valida con
  `quickAddFormSchema`, que exige `categoryId` para todo `INCOME`/`EXPENSE`
  (`quickAddFormSchema.ts:20-23`). También señaló una cita imprecisa
  (`windowManager.ts:12` no respalda la disponibilidad de DevTools).
- **v7** (2026-09-27): resuelve esa decisión — el usuario eligió exigir categoría antes de
  confirmar en vez de permitir "sin categorizar" y parchear en la edición. Cambios: (a) el
  Supuesto 4 pasa de "se puede dejar sin categorizar" a "categoría obligatoria antes de
  confirmar", igual que ya exige `quickAddFormSchema` para cualquier `INCOME`/`EXPENSE`
  cargado a mano; (b) el paso de previsualización (§3) refleja ese requisito con el botón de
  confirmar deshabilitado; (c) se corrige la cita de DevTools a `electron/main/index.ts:33`
  (`optimizer.watchWindowShortcuts`), que es lo que de verdad las habilita en dev, no
  `windowManager.ts:12`. Veredicto: **PASS**. Encontró dos cosas para pulir sin bloquear: el
  historial decía que "el schema Zod de filas parseadas (§4)" también reflejaba el requisito
  de categoría, lo cual es falso — el archivo nunca trae categoría, sólo el botón de
  confirmar la exige; y los AC de §7 sólo cubrían 2 de las 4 combinaciones fuente×formato que
  permite el alcance (MP+Excel/CSV, Galicia+PDF), dejando sin cubrir MP+PDF y Galicia+Excel/CSV.
- **v8** (2026-09-27): pulido post-PASS, sin volver a correr `/spec-review` (7 rondas ya
  convergieron; esto es documentación, no diseño). (a) se corrige el historial de la v7 para
  no atribuirle al schema de filas parseadas algo que sólo hace la UI; (b) se agregan los dos
  AC que faltaban (MP en PDF, Galicia en Excel/CSV) para cubrir las 4 combinaciones que
  permite el alcance (§2).
- **v9** (2026-09-27): se consiguieron los dos archivos de ejemplo reales que pedía el
  Supuesto 1/§6 (un resumen de cuenta MP en PDF y un resumen de tarjeta Visa Banco Galicia en
  PDF). Esto cierra el Supuesto 1 y obliga a corregir dos cosas que no se podían haber sabido
  sin el archivo real: (a) el resumen de Galicia es de **tarjeta de crédito**, no cuenta común,
  trae **dos titulares** en el mismo PDF (adicionales), líneas en **dólares** además de pesos
  (rompía el Supuesto 5 tal como estaba escrito), compras **en cuotas** (el monto de la fila es
  la cuota, no el total de la compra) y líneas que no son consumos (saldo anterior, pagos,
  impuestos, intereses, percepciones). Decisiones del usuario sobre esto: las filas en dólares
  se **excluyen** del parser (el Supuesto 5 queda confirmado, ahora con la salvedad explícita de
  que Galicia PDF puede traer líneas en USD que el parser debe filtrar); no se distingue
  titular, **todas** las filas en pesos de ambos titulares se importan igual contra la cuenta
  elegida; las líneas de saldo anterior/pago/impuestos/intereses/percepciones **sí** se
  importan como movimientos (no sólo los consumos), ya que representan igualmente dinero que
  entró o salió de la tarjeta en el período. (b) el resumen de MP sí coincide con lo asumido:
  tabla `Fecha | Descripción | ID operación | Valor | Saldo` en PDF. Cambios: Supuesto 1 pasa de
  suposición a confirmado con estructura real (§5); Supuesto 5 se corrige para reflejar la
  exclusión de USD en Galicia; §2 y §3 documentan que Galicia importa todo el detalle (consumos
  - pagos/impuestos/intereses), filtrando sólo las filas en USD; §6 cierra la pregunta abierta
    de archivos de ejemplo; §8 agrega los hallazgos medidos sobre la estructura real de ambos PDF
    (sin citar datos personales de los archivos, que no se versionan). No se corrieron los AC de
    §7 todavía (siguen bloqueados a que exista el parser), pero dejan de estar bloqueados por
    falta de archivo — ahora se pueden escribir con la estructura real como referencia.
- **v10** (2026-09-27): corrige el `/spec-review` de la v9, que dio **BLOCKED** por dos motivos
  y señaló dos "Importante". (a) §8 (NO MEDIDO) seguía diciendo que no había archivo de MP/Galicia
  y que un Excel/CSV real "no se necesita para esta feature", contradiciendo a §5/§6, que ya lo
  daban por resuelto para PDF y seguían pidiéndolo para Excel/CSV — se reescribe §8 para que
  diga exactamente eso, sin contradicción. (b) el único PDF de Galicia medido es de **tarjeta de
  crédito**; el AC (§7) afirmaba PDF de Galicia "cuenta común" como si estuviera confirmado — se
  corrige el AC a tarjeta (el caso medido) y "Galicia cuenta común" queda con el mismo estado
  que Excel/CSV: sin archivo real, no bloquea el plan pero no se puede dar por cerrado. (c) se
  agrega la regla de signo→tipo para el resumen de tarjeta que faltaba (§3, con lo medido en el
  PDF real: consumos/impuestos/intereses vienen en positivo → `EXPENSE`; pagos vienen en
  negativo → `INCOME`). (d) decisiones del usuario sobre los dos hallazgos "Importante" de
  dedup: **se acepta el riesgo** de que "saldo anterior" duplique en silencio al importar
  resúmenes consecutivos (no se excluye, se documenta como limitación conocida, mismo
  tratamiento que el Supuesto 6); y **se acepta como limitación conocida** que una cuota
  correspondiente a un mes distinto quede marcada como probable duplicado por default (no se
  agrega `CUOTA` a la clave de dedup) — el usuario la desmarca a mano en la previsualización.
- **v11** (2026-09-27): corrige el `/spec-review` de la v10, que dio **BLOCKED** por un único
  motivo: §7 no tenía ningún AC de MP en PDF (el único caso de MP con archivo real), el AC que
  decía "Excel/CSV de Mercado Pago" (heredado de v1-v8, cuando no había archivo real de PDF)
  seguía ahí pese a que la propia v10 ya lo dejaba fuera por falta de archivo, y el AC de Galicia
  se definía "igual al caso anterior" apuntando a ese AC no corrible — contradicción entre §7 y
  la propia v10. Nota aparte: la referencia de la v8 (más arriba en este historial) a "AC de MP
  en PDF y Galicia en Excel/CSV" quedó desactualizada por este reescritura de §7 en v9/v10/v11 —
  se mantiene tal cual como registro histórico de lo que se hizo en ese momento, no describe el
  §7 actual. Cambios de esta ronda: (a) se reescriben los dos AC de PDF para que cada uno hable
  del archivo que realmente mide (MP: PDF de MP con "Rendimientos"; Galicia: PDF de tarjeta con
  consumos/pagos/impuestos y regla de signo del §3), sin que uno dependa del otro; (b) se saca el
  AC genérico de `CREDIT_CARD` que quedaba redundante con el de Galicia; (c) se fija cómo el
  parser normaliza fecha a `yyyy-MM-dd` antes del schema Zod (§4): MP ya trae año de 4 dígitos,
  Galicia trae año de 2 dígitos y se interpreta como `20aa`; (d) el AC de fila inválida ahora dice
  contra qué archivo se prueba (MP, forzando el formato de fecha original) y no promete un
  comportamiento único todavía no decidido — deja el excluir-vs-marcar-error explícitamente para
  `/speckit-plan` (ya estaba abierto en §6).
- **v12** (2026-09-27): corrige el `/spec-review` de la v11, que dio **BLOCKED** por un único
  motivo: el AC de fila inválida (v11) pedía dejar la fecha en formato original `dd-mm-yyyy` para
  que el schema Zod la rechazara, pero §4 ya establece que el parser normaliza la fecha **antes**
  de llegar a ese schema — con la fila normalizada, nunca falla. Se reemplaza el AC por uno que
  fuerza una fecha imposible (`32-13-2026`) o un monto no numérico, algo que el parser no puede
  normalizar y que sí llega roto al schema.
- **v13** (2026-09-27): pulido post-PASS de la v12, sin volver a correr `/spec-review` (mismo
  criterio que v8: son ajustes acotados, no cambios de diseño). Corrige 3 de los 4 "Importante"
  que señaló la ronda de la v12: (a) el schema Zod de §4 ahora exige que `date` sea una fecha de
  calendario válida, no sólo `\d{4}-\d{2}-\d{2}` (si no, `32-13-2026` colaba como
  `2026-13-32` y el AC de fila inválida de la v12 no disparaba); (b) se agrega que
  `useImportMovements` valida las filas ya confirmadas contra un segundo schema con
  `categoryId` obligatorio antes de armar el array para `addManyMovements`, en vez de confiar
  sólo en el botón de confirmar deshabilitado; (c) el AC de edición/borrado aclara que hay que
  cambiar el filtro de `PaymentsListPage` a Pagados/Todos para ver un movimiento importado,
  porque el default es `PENDING` y la mayoría de las filas importadas son de fecha pasada. El
  cuarto punto ("Excel/CSV y Galicia cuenta común están en el alcance sin ningún AC") no es un
  ajuste de este spec — es trabajo para que `/speckit-plan` marque como diferido, ya documentado
  en §5 (Supuesto 1), §6 y §8.

# 1. Qué es

Una forma de subir boletas/resúmenes de cuenta (Mercado Pago y Banco Galicia, en Excel/CSV o
PDF) y que la app parsee cada fila y cree automáticamente los movimientos correspondientes
(`Movement`), en vez de cargarlos uno por uno a mano desde Quick Add. El usuario elige a qué
cuenta de la app corresponde el archivo, revisa/edita/categoriza las filas detectadas en una
pantalla de previsualización, y confirma para que se creen los movimientos, **como registro histórico**: no se aplica
efecto de saldo (ni `balance` ni `usedAmount`) — a diferencia de lo que hace
`recordMovementThunk` con un movimiento cargado a mano (ver Supuesto 10, §5).

# 2. Alcance

**Dentro:**

- Subir un archivo Excel/CSV o PDF exportado desde Mercado Pago o desde Banco Galicia (cuenta
  común/billetera o tarjeta de crédito).
- Parsear el archivo a filas candidatas (fecha, monto, descripción, signo/dirección).
- Pantalla de previsualización: por fila, editar categoría, excluir la fila, y ver un aviso
  cuando la fila parece ya existir como movimiento cargado.
- Confirmar la importación: crear un `Movement` por cada fila no excluida, contra la cuenta
  elegida por el usuario, **sin** aplicar el efecto de saldo que sí aplica
  `recordMovementThunk` para una carga manual (`src/store/movements/movementThunks.ts:69-81`)
  — ver Supuesto 10 (§5).
- Soporte para cuentas de tipo `CREDIT_CARD` además de cuentas comunes/billetera como destino
  de la importación (en ambos casos el movimiento queda como registro histórico, sin tocar
  `usedAmount` ni `balance`).
- Para el resumen de tarjeta Galicia (PDF): importar **todo** el detalle en pesos del período
  (consumos de cualquier titular/adicional **y** líneas de saldo anterior, pagos, impuestos,
  intereses y percepciones), no sólo los consumos — confirmado en la v9 tras medir un archivo
  real (§5, Supuesto 1). No se distingue entre titular y adicional: todas las filas en pesos
  entran igual.

**Fuera:**

- Detectar o fusionar automáticamente transferencias entre dos archivos distintos (ej. un
  ingreso en Galicia que es en realidad un retiro de MP). Cada archivo se importa
  independiente contra la cuenta elegida; si ambas cuentas están en la app, puede quedar
  duplicado como Ingreso en un lado y Gasto en el otro. Ver Supuesto 6 (§5).
- Detección automática del banco/billetera a partir del contenido del archivo (el usuario
  elige explícitamente "Mercado Pago" o "Banco Galicia" antes de subir).
- Múltiples monedas: se asume ARS únicamente (ver Supuesto 5). El resumen de Galicia puede
  traer líneas en dólares (compras/servicios facturados en USD); esas filas se **excluyen** del
  parser, no se importan ni convertidas ni como fila con error — confirmado con un archivo real
  en la v9. "Agregar dólares" (`docs/pending.md:25`) es un pendiente aparte.
- Reconciliación con pagos (`Payment`) — un movimiento importado no se vincula a un
  `Payment` existente ni lo marca como pagado.
- Cualquier fuente que no sea Mercado Pago o Banco Galicia.

# 3. Cómo debería funcionar

1. Desde algún punto de entrada nuevo (a definir en el plan: p. ej. un botón en
   `AccountsPage` o en `PaymentsListPage` — donde hoy vive la vista de movimientos/timeline,
   `src/modules/payments/PaymentsListPage.tsx:20` — o una opción en Quick Add), el usuario
   elige "Importar boleta".
2. Elige la fuente (Mercado Pago o Banco Galicia) y la cuenta destino de la app
   (`selectAllAccounts`, mismo selector que ya usa `StepAmountAndDetails.tsx:60`).
3. Sube el archivo (Excel/CSV o PDF). La app lo parsea contra el mapeo de columnas/formato de
   esa fuente — confirmado para PDF con archivos reales (Supuesto 1, §5); para Excel/CSV el
   mapeo sigue sin confirmar con un archivo real. Para Galicia, el parser recorre tanto la
   sección `DETALLE DEL CONSUMO` (de cualquier titular/adicional) como las líneas sueltas de
   saldo anterior/pagos/impuestos/intereses/percepciones, y descarta cualquier fila cuyo monto
   esté en dólares (Supuesto 5).

4. Se muestra una pantalla de previsualización con una fila por movimiento detectado: fecha,
   monto, descripción/nota, categoría (editable, `CategoryField` ya usado en
   `StepAmountAndDetails.tsx:325`, obligatoria — Supuesto 4, §5), y un checkbox de inclusión.
   Las filas que calzan en fecha+monto+`type`+cuenta con un movimiento ya existente aparecen
   marcadas como probable duplicado y excluidas por default (chequeo de negocio, Supuesto 9 —
   distinto de la validación de estructura de la fila, que sí es Principio II, ver §4).
5. El usuario ajusta lo que haga falta — toda fila incluida necesita categoría asignada, igual
   que exige `quickAddFormSchema` para cualquier `INCOME`/`EXPENSE` cargado a mano
   (`src/validation/quickAddFormSchema.ts:20-23`) — y confirma; el botón de confirmar queda
   deshabilitado mientras haya una fila incluida sin categoría.
6. Por cada fila incluida se crea un `Movement`:
   - `type`: `MovementType.INCOME` o `EXPENSE` según el signo del monto en el archivo. Para MP
     y para una cuenta común, positivo → `INCOME`, negativo → `EXPENSE` (signo del extracto).
     Para el resumen de tarjeta Galicia el signo va al revés, confirmado con el PDF real
     (Supuesto 1, §5): un consumo, impuesto, interés o percepción viene en **positivo**
     (aumenta la deuda) → `EXPENSE`; un pago o pago anticipado viene en **negativo** (reduce la
     deuda) → `INCOME`. Es la misma regla "el signo del archivo decide el tipo", aplicada según
     la convención de signo real de cada fuente, no una regla distinta por fuente. **No** se usa
     `MovementType.CARD_PAYMENT`, porque ese tipo es para el pago de la tarjeta desde otra
     cuenta, no para los consumos/movimientos de la tarjeta en sí.
   - `amount`: se guarda como valor absoluto (`Math.abs`), igual que un movimiento cargado a
     mano (`quickAddFormSchema.ts:11`, `.positive('El monto debe ser mayor a 0')`) — el signo
     del archivo sólo decide `type`, no queda codificado dos veces.
   - `date`: `yyyy-MM-dd`, sin componente de hora — mismo formato que usa todo el dominio
     (`src/store/vault/demoVaultData.ts:36-38`, `format(date, 'yyyy-MM-dd')`).
   - `accountId`: la cuenta elegida por el usuario en el paso 2.
   - `ownerType`/`ownerId`: heredados de esa misma cuenta (`Account.ownerType`/`ownerId`,
     `src/validation/accountSchema.ts:8-9`) — ver Supuesto 11 (§5).
   - Se dispatchea **una sola vez** para todas las filas de la importación, vía un hook plano
     que llama `dispatch(addManyMovements(rows))` directo — **no** un `createAsyncThunk` (ver
     Supuesto 7, §5) — y **no** se pasa por `recordMovementThunk`/`applyMovementBalanceEffect`
     (`src/store/movements/movementThunks.ts:19-67`): el saldo (`balance`/`usedAmount`) de la
     cuenta no cambia — ver Supuesto 10 (§5).
7. Cada movimiento creado se marca con `isImported: true` (Supuesto 8, §5) y queda
   editable/borrable después desde `EditMovementDialog`/`DeleteMovementDialog`
   (`src/modules/timeline/components/`), que hoy se renderizan dentro de `PaymentsListPage`
   (`src/modules/payments/PaymentsListPage.tsx:20-21,312`) — no hay una ruta de edición
   especial para movimientos importados. Editarlo o borrarlo **no** aplica ni revierte efecto
   de saldo, sin importar qué campo se cambie (fecha, monto, tipo o cuenta): `isImported`
   queda pegado al movimiento para siempre, no se le saca al editarlo (Supuestos 8 y 12, §5).

# 4. Datos

- **Slice tocado**: `src/store/movements/movementsSlice.ts` — se agrega un reducer nuevo,
  `addManyMovements` (`movementsAdapter.addMany`, mismo adapter que ya usa el slice,
  `src/store/movements/movementsSlice.ts:5-7`). La confirmación de la importación se maneja
  con un hook plano en el módulo del feature (p. ej. `useImportMovements`), que arma el array
  de `Movement` (fecha `yyyy-MM-dd`, `amount` en valor absoluto, `ownerType`/`ownerId`
  heredados de la cuenta) y hace `dispatch(addManyMovements(rows))` **una sola vez**, mismo
  patrón que ya usan `useCreatePayment`/`useDeletePayment`
  (`src/modules/payments/useCreatePayment.ts:10-46`: dispatch directo de una acción del slice,
  sin `createAsyncThunk`). **No** se agrega un thunk en `movementThunks.ts` ni se reusa
  `recordMovementThunk`: ese archivo sólo tiene `createAsyncThunk`s
  (`src/store/movements/movementThunks.ts:9`), cuyo ciclo de vida dispara acciones
  `movements/<nombre>/pending` y `/fulfilled` además de la de negocio — `persistenceMiddleware`
  las cuenta igual por el prefijo `movements/` (`src/store/middleware/persistenceMiddleware.ts:24-29`),
  así que un thunk ahí rompería el guardado único (Supuesto 7, §5). Tampoco se pasa por
  `applyMovementBalanceEffect` (`src/store/movements/movementThunks.ts:19-67`): los
  movimientos importados no tocan el saldo (Supuesto 10, §5).
- **Nuevo schema de validación**: `src/validation/*` necesita un schema Zod para las filas que
  vuelven del parseo (vía IPC) antes de llegar a la previsualización — `date` como
  `yyyy-MM-dd` estricto **y válida como fecha de calendario** (mes 01-12, día válido para ese
  mes — un regex de forma no alcanza: `2026-13-32` no es fecha aunque matchee `\d{4}-\d{2}-\d{2}`)
  para no romper el chequeo de duplicados del Supuesto 9, monto finito y distinto de cero,
  dirección/signo — siguiendo el patrón ya
  vigente de "validar en el borde" (Principio II) que usan el resto de los formularios
  (`react-hook-form` + Zod/Yup en `src/validation/*`). El parser de cada fuente convierte su
  formato de fecha original a `yyyy-MM-dd` **antes** de que la fila llegue a este schema: MP trae
  `dd-mm-yyyy` (año de 4 dígitos, sin ambigüedad — §8); Galicia trae `dd-mm-aa` (año de 2
  dígitos, §8), que se interpreta como `20aa` (siglo XXI) — el dominio de esta app no tiene
  movimientos de fechas anteriores al año 2000. Esto es una validación de estructura del
  parseo, no reemplaza el chequeo de duplicados (Supuesto 9, §5), que es un chequeo de negocio
  distinto. La previsualización en sí no necesita envolverse en `react-hook-form` (Supuesto 13,
  §5). Ese schema de fila **parseada** no exige `categoryId` (el archivo de origen nunca lo
  trae, §5 Supuesto 4) — la categoría la carga el usuario en la previsualización, y hoy sólo el
  botón de confirmar deshabilitado impide seguir sin ella. Como los reducers asumen datos
  válidos (`constitution.md:33-35`) y no hay garantía a nivel de tipo de que todas las filas
  confirmadas tengan categoría, `useImportMovements` valida las filas **ya confirmadas** (con
  `categoryId`, justo antes de armar el array para `addManyMovements`) contra un segundo schema
  derivado del primero con `categoryId` obligatorio — mismo criterio que exige
  `quickAddFormSchema` para `INCOME`/`EXPENSE` (`quickAddFormSchema.ts:20-23`) — en vez de
  confiar únicamente en que el botón deshabilitado nunca se saltee.
- **Tipo del vault**: `Movement` (`src/validation/movementSchema.ts`) — se agrega el campo
  opcional `isImported: z.boolean().optional()`. `removeMovementThunk`/`updateMovementThunk`
  (`src/store/movements/movementThunks.ts:83-115`) se modifican para no llamar
  `applyMovementBalanceEffect` cuando `movement.isImported` es `true`, y `updateMovementThunk`
  además fuerza `isImported` desde `oldMovement` al armar `newMovement` en vez de confiar en
  `input.changes` (Supuesto 12, §5) — a diferencia de las v1-v3, acá sí se toca el schema y
  esos dos thunks existentes. No hace falta tocar `useUpdateMovement.ts` para esto (el thunk
  es el único punto de control), pero si en el futuro se agrega otra forma de editar un
  movimiento que no pase por `updateMovementThunk`, esa vía también queda cubierta porque el
  forzado vive en el thunk, no en cada hook.
- **Canales IPC**: nuevo(s) canal(es) en `shared/ipcChannels.ts`, análogos a
  `ATTACHMENT_SAVE`/`ATTACHMENT_OPEN` (`shared/ipcChannels.ts:11-13`), para leer el archivo
  subido y devolver las filas parseadas — el parseo de Excel/CSV y PDF corre en el proceso
  main (Node), igual que hoy corre el guardado de adjuntos
  (`electron/main/ipc/attachmentHandlers.ts:7-19`, `attachmentsStorage.ts:19-33`), no en el
  renderer.

  > ⚠ Depende del Supuesto 2 (§5): que el parseo se haga en main y no en el renderer.

- **Household/vault**: no aplica cambio de estructura del `VaultEnvelope`
  (`shared/vaultEnvelope.types.ts`) — los movimientos importados son `Movement` normales.

# 5. Supuestos

1. **Formato de columnas de MP y Galicia — confirmado en la v9 con un archivo real de cada
   fuente (PDF).** MP: tabla `Fecha | Descripción | ID de la operación | Valor | Saldo`, una fila
   por movimiento (incluye ingresos, egresos y "rendimientos" diarios). Galicia: es un resumen
   de **tarjeta de crédito** (no cuenta común), con una sección `DETALLE DEL CONSUMO` por cada
   titular/adicional (`FECHA | REFERENCIA | CUOTA | COMPROBANTE | PESOS | DÓLARES`) más líneas
   sueltas de saldo anterior, pagos e impuestos/intereses/percepciones fuera de esa tabla, todas
   con fecha y monto en pesos o dólares. No se probó todavía con un archivo Excel/CSV real de
   ninguna de las dos fuentes (los dos ejemplos conseguidos son PDF) — el alcance (§2) sigue
   pidiendo soportar Excel/CSV para ambas, pero el mapeo de columnas de esa variante sigue sin
   confirmar. _Si el Excel/CSV real difiere de lo asumido acá_: hay que ajustar ese parser
   específico con un archivo de ejemplo antes de darlo por terminado — ya no bloquea empezar
   `/speckit-plan` (el caso PDF, más complejo, ya está confirmado), pero sí bloquea cerrar esa
   combinación fuente×formato.
2. **El parseo corre en el proceso main**, igual que el resto del acceso a filesystem
   (`electron/main/persistence/attachmentsStorage.ts`), en vez de en el renderer. _Si es
   falso_ (se decide parsear en el renderer): cambia qué proceso necesita la nueva dependencia
   de parseo y cómo se pasa el archivo (hoy los adjuntos viajan como base64 desde el renderer,
   `AttachmentSavePayload.fileData`, mismo patrón esperable acá).
3. **Se agrega como máximo una librería de Excel/CSV (ej. `xlsx` o similar) y una de extracción
   de texto de PDF**, ambas sólo para este flujo. _Si el usuario prefiere no depender de
   librerías de PDF_ (más frágiles): el soporte PDF de esta spec podría degradarse a "pegar el
   texto copiado del PDF" en vez de parsear el binario — pero la entrevista confirmó "ambos
   formatos" sin esa salvedad, así que se asume parseo real de binario PDF.
4. **No hay auto-mapeo de categoría por texto de comercio/descripción, pero la categoría es
   obligatoria antes de confirmar** — decisión tomada en la v7 tras encontrar que
   `EditMovementForm` valida con `quickAddFormSchema`, que exige `categoryId` para todo
   `INCOME`/`EXPENSE` (`src/validation/quickAddFormSchema.ts:20-23`); un movimiento importado
   "sin categorizar" quedaría sin poder editarse después con ese mismo diálogo. La categoría
   se asigna manualmente por fila en la previsualización (`CategoryField`,
   `StepAmountAndDetails.tsx:325`) y el botón de confirmar queda deshabilitado mientras falte
   en alguna fila incluida. _Si es falso_ (se decide permitir "sin categorizar" de nuevo): hay
   que resolver aparte cómo se edita después un movimiento importado sin categoría, porque
   `EditMovementForm` no lo admite tal cual hoy.
5. **Las boletas importadas son en pesos (`Currency.ARS`)** — no se contempla `USD` en este
   flujo. Confirmado con el archivo real de Galicia (v9): el resumen de tarjeta trae columna
   `DÓLARES` separada de `PESOS` (y líneas sueltas con montos en USD, ej. suscripciones
   facturadas en dólares); el parser debe **filtrar/descartar** cualquier fila cuyo monto esté
   en la columna o marca de dólares, sin mostrarla en la previsualización ni contarla como fila
   con error — es una fila fuera de alcance, no inválida. _Si es falso_ (se decide importar
   igual): hay que decidir cómo el parser distingue el signo de moneda por fila y qué tipo de
   cambio usar, lo cual no está en el alcance de "Agregar dólares" (`docs/pending.md:25`)
   todavía.
6. **No hay detección de transferencias entre archivos** (confirmado en la entrevista: "Importar
   independiente por archivo"). Si el usuario importa el mismo movimiento de plata desde ambas
   boletas (MP y Galicia) y tiene ambas cuentas en la app, puede quedar contado dos veces
   (una vez como salida de una cuenta, otra como entrada en la otra). _Mitigación parcial_: el
   chequeo de duplicados (Supuesto 9) sólo detecta filas repetidas **dentro de la misma cuenta
   destino**, no entre archivos distintos contra cuentas distintas.
   Mismo riesgo aplica, dentro de un mismo archivo Galicia, a la fila "saldo anterior" (§2): es
   la suma agregada de las filas del período previo, que ya se importaron una por una — el
   chequeo de duplicados (Supuesto 9) no la reconoce como tal porque compara filas individuales,
   no un agregado. Decisión del usuario (v10): se **acepta el riesgo**, no se excluye "saldo
   anterior" del import — el usuario revisa la previsualización antes de confirmar.
7. **La importación dispatchea `addManyMovements` una sola vez para todas las filas incluidas**
   (`movementsAdapter.addMany`, ver §4), desde un hook plano — **no** desde un
   `createAsyncThunk`. Un `createAsyncThunk` (el patrón que ya usa
   `src/store/movements/movementThunks.ts:9,69-70`) dispara además
   `movements/<nombre>/pending` y `/fulfilled`, y `persistenceMiddleware` cuenta cualquier tipo
   que empiece con `movements/` como mutante salvo que el nombre empiece con `hydrate`
   (`src/store/middleware/persistenceMiddleware.ts:24-29`) — con un thunk así serían 3
   guardados, no 1. Con el hook plano (`dispatch(addManyMovements(rows))` directo) sólo hay un
   tipo de acción. Al no aplicar efecto de saldo (Supuesto 10) tampoco hay dispatches
   `accounts/updateAccount` de por medio, así que una importación de 40 filas dispara **un
   solo** guardado del vault. _Si esto cambiara_ (por ejemplo si en el futuro se decide sí
   aplicar efecto de saldo, o se envuelve la importación en un `createAsyncThunk` por algún
   motivo): hay que revisar de nuevo cuántas acciones mutantes dispara el ciclo completo antes
   de asumir "un guardado por importación".
8. **Se agrega `isImported?: boolean` a `movementSchema.ts`** para distinguir un movimiento
   importado de uno cargado a mano — decisión tomada en la v4 tras encontrar el problema del
   Supuesto 12 (§5): sin esta marca, borrar o reasignar tipo/cuenta a un movimiento importado
   pasa por `removeMovementThunk`/`updateMovementThunk`
   (`src/store/movements/movementThunks.ts:83-115`), que revierten un efecto de saldo que la
   importación nunca aplicó, inflando `balance`/`usedAmount`. _Consecuencia_: un movimiento
   importado **nunca** aplica efecto de saldo, ni siquiera si más adelante se le edita el
   monto o la fecha desde `EditMovementDialog` — queda permanentemente como registro
   histórico. _Si esto no alcanza_ (por ejemplo, si se quiere que un movimiento importado
   "se convierta" en uno normal tras editarlo): hace falta una regla explícita de cuándo se
   le saca la marca, que no está definida acá.
9. **El chequeo de duplicados compara `date` (string `yyyy-MM-dd`, sin hora) + `amount`
   (valor absoluto) + `type` + misma cuenta destino** contra movimientos existentes
   (`movementsSelectors`, `src/store/movements/movementsSlice.ts:25`) — se incluye `type` para
   no marcar como duplicado un ingreso y un gasto del mismo monto y día, y se compara por
   string de fecha (no por hora) porque `Movement.date` en toda la app ya es sólo
   `yyyy-MM-dd` (`src/store/vault/demoVaultData.ts:36-38`). No compara descripción/nota porque
   el texto libre de MP/Galicia puede no ser estable entre descargas del mismo período. _Si es
   falso_: el chequeo puede tener falsos positivos (dos gastos distintos, mismo día y monto) o
   falsos negativos (mismo gasto con centavos redondeados distinto entre exportaciones).
   La clave **no** incluye `CUOTA` (Galicia): una compra en cuotas tiene la misma fecha de
   compra, mismo monto de cuota y mismo tipo/cuenta en cada resumen mensual, así que la cuota
   del mes siguiente cae en la misma clave que la del mes anterior y queda marcada como probable
   duplicado por default. Decisión del usuario (v10): se **acepta como limitación conocida** —
   el usuario desmarca a mano cada cuota que sí corresponde incluir en la previsualización, en
   vez de agregar `CUOTA` a la clave de dedup.
10. **La importación no aplica efecto de saldo** (ni `balance` ni `usedAmount`): el usuario ya
    mantiene el saldo de la cuenta actualizado a mano (`Account.balance`/`usedAmount`,
    `src/validation/accountSchema.ts:10,15`), y una boleta es casi siempre de un período
    pasado — aplicar el efecto de vuelta sobre gastos que ya ocurrieron lo descontaría dos
    veces. _Si es falso_ (se decide aplicar el efecto): hay que exigirle al usuario que ponga
    el saldo de la cuenta en el valor de _antes_ del período importado, y el chequeo de
    duplicados (Supuesto 9) pasa a ser crítico para no descontar dos veces un mismo gasto.
    Este supuesto se sostiene incluso si más adelante se edita el movimiento importado, gracias
    a la marca `isImported` (Supuestos 8 y 12, §5): a diferencia de un borrador anterior de este
    spec, editar/borrar un movimiento importado **no** dispara `applyMovementBalanceEffect`.
11. **`ownerType`/`ownerId` de un movimiento importado se heredan de la cuenta destino**
    elegida en el paso 2 (`Account.ownerType`/`ownerId`, `src/validation/accountSchema.ts:8-9`),
    en vez de pedírselos al usuario por fila o por archivo. _Si es falso_: hay que agregar un
    selector de dueño en la pantalla de previsualización (por fila o global), igual al patrón
    `MemberOwnerField` (`src/components/shared/MemberOwnerField.tsx`).
12. **`removeMovementThunk` y `updateMovementThunk` chequean `movement.isImported` antes de
    llamar `applyMovementBalanceEffect`** (`src/store/movements/movementThunks.ts:83-115`): si
    `isImported` es `true`, se saltea el efecto de saldo (tanto al revertir el viejo como al
    aplicar el nuevo). Sin este cambio, borrar un gasto importado sumaría su monto al
    `balance` (o bajaría `usedAmount` en una tarjeta) aunque nunca se descontó al crearlo — es
    el problema que encontró la revisión de la v3. Además, **`updateMovementThunk` fuerza
    `isImported` desde `oldMovement`** al construir `newMovement`
    (`src/store/movements/movementThunks.ts:95`, hoy `{ ...input.changes, id: input.id }`) —
    **no** confía en que `input.changes.isImported` venga seteado. Esto es necesario porque
    `useUpdateMovement.ts:20-35` arma `changes` campo por campo a mano y sólo reenvía
    `ownerType`/`ownerId`/`paymentId` del movimiento original (tampoco reenvía `currency`, por
    ejemplo) — cualquier campo no listado ahí se pierde silenciosamente en la primera edición.
    Como `isImported` se agrega a `movementSchema` como `.optional()` (§4), también es opcional
    en `Omit<Movement, 'id'>` (`UpdateMovementInput`, `movementThunks.ts:12`), así que
    TypeScript no marca error si el hook simplemente no lo incluye. _Si es falso_ (no se toca
    esos thunks, o se confía en que cada hook que
    llama a `updateMovementThunk` reenvíe `isImported` a mano): el Supuesto 8 no cumple lo que
    promete, y editar un movimiento importado (aunque sea para cambiarle sólo la nota) lo
    "blanquea" y a partir de ahí sí aplica efecto de saldo.
13. **La pantalla de previsualización no es un formulario `react-hook-form`** — es una tabla
    editable con estado plano por fila (categoría, checkbox de inclusión), mismo patrón que ya
    usa `CategoryField` con `useState` en vez de un form context
    (`src/modules/quickAdd/steps/StepAmountAndDetails.tsx:68,325-330`,
    `src/components/shared/CategoryField.tsx:10-20`). La validación de borde que exige el
    Principio II se cumple con el schema Zod de las filas parseadas (§4), no envolviendo la
    tabla en un `react-hook-form`. _Si es falso_: hay que definir un array de campos
    `react-hook-form` (`useFieldArray`) para la previsualización, que no tiene precedente en
    el repo hoy.

# 6. Preguntas abiertas

- **Punto de entrada en la UI**: ¿un botón nuevo en `AccountsPage`, en `PaymentsListPage`
  (donde hoy vive el timeline de movimientos), un paso extra en Quick Add, o una pantalla
  propia accesible desde el menú? No se preguntó en la
  entrevista (encaja mejor en `/speckit-plan`, es una decisión de UI/navegación, no de datos).
  Bloquea: dónde vive el componente de entrada y su ruta en `AppRouter.tsx`.
- ~~**Archivos de ejemplo reales de MP y Galicia**~~ — **Resuelto en v9**: se consiguió un PDF
  real de cada fuente (ver Supuesto 1, §5). Sigue abierto el mapeo de columnas para la variante
  Excel/CSV de ambas fuentes, que no bloquea empezar `/speckit-plan` pero sí cerrar esa
  combinación fuente×formato del alcance (§2).
- **Límite de tamaño/filas por importación**: no se definió un máximo de filas por archivo ni
  qué pasa con un archivo corrupto/no reconocido más allá de mostrar un error. Bloquea: el
  manejo de error en la pantalla de previsualización.

# 7. Acceptance criteria

> ⚠ Resuelto en v9 para PDF (ver §5, Supuesto 1): ya hay un archivo de ejemplo real de MP y de
> Galicia en PDF, así que los AC de esa combinación se pueden correr una vez implementado el
> parser. Los AC de Excel/CSV siguen condicionados a conseguir un archivo de ejemplo real de esa
> variante (§6).

- `yarn typecheck` y `yarn lint` pasan sin errores tras agregar el flujo de importación y la(s)
  nueva(s) dependencia(s) de parseo.
- Con `yarn dev`: subir el PDF de ejemplo de Mercado Pago (el caso medido — Supuesto 1, §5)
  contra una cuenta común muestra la previsualización con fecha/monto/descripción por fila
  (incluyendo filas de "Rendimientos"), y confirmar crea los `Movement` correspondientes,
  **sin** cambiar el `balance` de la cuenta en `AccountsPage` (Supuesto 10).
- Subir el PDF de ejemplo de Banco Galicia (**tarjeta de crédito**, el caso medido — Supuesto 1,
  §5) contra una cuenta `CREDIT_CARD` produce un resultado análogo al de MP — previsualización
  con fecha/monto/descripción por fila, incluyendo consumos, pagos e impuestos/intereses del
  detalle (§2), con la regla de signo→tipo de Galicia (§3) aplicada (consumos/impuestos como
  `EXPENSE`, pagos como `INCOME`), sin filas en dólares (Supuesto 5), y sin tocar `usedAmount`.
  "Galicia cuenta común" en PDF y ambas fuentes en Excel/CSV quedan **fuera** de este AC: no hay
  archivo real medido de esas combinaciones (§5, Supuesto 1; §6) y no se pueden dar por
  cumplidas todavía — quedan condicionadas a conseguir esos archivos, sin bloquear el resto del
  plan.
- Volver a subir el mismo PDF de Galicia (mismas filas) contra la misma cuenta `CREDIT_CARD`
  muestra las filas como probable duplicado, excluidas por default en la previsualización
  (clave: fecha + monto + `type` + cuenta, Supuesto 9) — con la salvedad ya documentada de
  "saldo anterior" (Supuesto 6) y de cuotas de mes distinto (Supuesto 9), que no se resuelven
  con este AC.
- Excluir una fila en la previsualización antes de confirmar (en cualquiera de los dos PDF de
  ejemplo) hace que no se cree ningún `Movement` para esa fila.
- Editar el PDF de ejemplo de MP (o armar un fixture calcado) para que una fila traiga una fecha
  imposible (ej. `32-13-2026`) o un monto no numérico hace que el parser no la pueda normalizar
  a `yyyy-MM-dd`/número (§4) y el schema Zod la rechace antes de la previsualización: el manejo
  puntual (excluir la fila vs. marcarla con error visible) queda a definir en `/speckit-plan` —
  ver Pregunta abierta de límite/errores (§6) —, pero en ningún caso esa fila llega a `dispatch`.
- Un movimiento creado por importación aparece (cambiando el filtro de `PaymentsListPage` a
  Pagados o Todos — la mayoría de las filas importadas son de fecha pasada y entran como
  `PAID`, no `PENDING`, que es el filtro default) y se puede editar/borrar desde
  `EditMovementDialog`/`DeleteMovementDialog` igual que uno cargado manualmente.
- Una importación de varias filas dispara **un solo** guardado del vault (Supuesto 7) — el
  proyecto no tiene instalada la extensión Redux DevTools (no hay
  `electron-devtools-installer` en `package.json`), así que se verifica abriendo las DevTools
  de Chromium (`Ctrl+Shift+I` o F12; en dev, `optimizer.watchWindowShortcuts`
  (`electron/main/index.ts:33`) habilita ese atajo) y agregando temporalmente un
  `console.log(actionType)` **después** del `if (!actionType || !isMutatingAction(actionType))`
  (`src/store/middleware/persistenceMiddleware.ts:38-40`), no dentro de `isMutatingAction` —
  ahí también entrarían acciones que no llegan a guardar. Al importar debe imprimir
  exactamente una línea, `movements/addManyMovements` (no `movements/.../pending` ni
  `/fulfilled`, y no una línea por fila).
- Editar sólo la nota de un movimiento importado desde `EditMovementDialog` y después borrarlo
  no cambia el `balance`/`usedAmount` de la cuenta en ningún momento (Supuesto 12) — confirma
  que `isImported` sobrevive a la edición en vez de perderse en la primera vuelta.

# Constitution Check

Verificación contra `.specify/memory/constitution.md` (v1.1.0):

- **Principio I (Local-First)** — PASS. El parseo de Excel/CSV/PDF corre en el proceso main
  (§4); no hay ningún canal IPC ni librería que envíe el archivo o sus filas a un servicio
  externo.
- **Principio II (Validación en los bordes)** — PASS con salvedad. Se agrega un schema Zod
  para las filas parseadas antes de la previsualización (§4, Supuesto 13); el chequeo de
  duplicados es un paso de negocio aparte (Supuesto 9), no un reemplazo de esa validación. La
  previsualización en sí no pasa por `react-hook-form` (Supuesto 13) — el precedente citado
  (`StepAmountAndDetails.tsx`) es en sí mismo un desvío ya existente de la letra del Principio
  II ("toda entrada de usuario MUST validarse en el formulario… react-hook-form + Zod/Yup"),
  no un patrón que la constitución avale explícitamente. Se acepta acá porque lo único
  editable en la previsualización es un id de categoría (select) y un checkbox de inclusión,
  mismo alcance que ya cubre sin problemas ese precedente.
- **Principio III (Arquitectura por módulo)** — **A definir en `/speckit-plan`**: el punto de
  entrada y el módulo dueño del flujo de importación quedan como Pregunta abierta (§6); no se
  puede verificar cumplimiento hasta que el plan decida en qué módulo vive.
- **Principio IV (Consistencia de UI)** — PASS. Se reusa `CategoryField` para categorizar
  filas (Supuesto 13) y se espera reusar `FormSectionHeader`/`LeafButton` para la pantalla de
  importación, mismo patrón que `StepAmountAndDetails.tsx` (§8, KNOWN).
- **Principio V (YAGNI)** — PASS. La(s) dependencia(s) nueva(s) de parseo resuelven una
  necesidad ya documentada (`docs/pending.md:28`); no se introduce infraestructura adicional
  (sin backend, sin colas).
- **Restricciones tecnológicas** — PASS. No se cambia el stack (Electron/React/Redux
  Toolkit/Zod); sólo se suma una librería de parseo de archivo, acotada a este flujo.

# 8. Contexto medido

**KNOWN** (verificado, con cita):

- No existe hoy ninguna dependencia de parseo de Excel/CSV/PDF en `package.json` — sólo
  `zod`/`yup` para validación de formularios (`package.json` sección `dependencies`).
- Los adjuntos de pagos ya aceptan PDF (`src/modules/payments/components/AttachmentList.tsx:53`,
  `accept="application/pdf,image/*"`) y el guardado de archivos corre en el proceso main
  (`electron/main/persistence/attachmentsStorage.ts:19-33`), vía IPC
  (`electron/main/ipc/attachmentHandlers.ts:7-19`).
- `recordMovementThunk` crea el `Movement` y aplica el efecto de saldo sólo si la fecha es
  hoy o pasada (`src/store/movements/movementThunks.ts:14-17,69-81`); para cuentas
  `CREDIT_CARD` ajusta `usedAmount`, para el resto `balance`
  (`src/store/movements/movementThunks.ts:47-54`). `removeMovementThunk` y
  `updateMovementThunk` revierten/reaplican ese mismo efecto para toda fecha pasada, sin
  chequear ningún otro campo del movimiento (`src/store/movements/movementThunks.ts:83-115`)
  — por eso hace falta el flag `isImported` (Supuesto 8, §5).
- `movementSchema` no tiene ningún campo de trazabilidad de origen/importación hoy
  (`src/validation/movementSchema.ts:4-17`) — se agrega `isImported` como parte de esta
  feature (§4).
- `useUpdateMovement.ts:20-35` arma el objeto `changes` de `updateMovementThunk` campo por
  campo, reenviando manualmente sólo `ownerType`, `ownerId` y `paymentId` del movimiento
  original (tampoco reenvía `currency`, por ejemplo) — cualquier campo opcional no listado ahí
  se pierde en una edición. `UpdateMovementInput` (`movementThunks.ts:12`) no hace opcionales
  todos sus campos (`type`/`amount`/`date`/`accountId`/`ownerType` son obligatorios), pero
  `isImported` sí lo es porque se agrega a `movementSchema` como `.optional()` (§4). Es la
  razón por la que `isImported` no puede depender de ese hook (Supuesto 12).
- El proyecto no tiene instalada la extensión Redux DevTools (`electron-devtools-installer` no
  aparece en `package.json`); `configureStore` deja habilitado el hook de conexión
  (`src/store/index.ts:5`) pero no hay nada que cargue la extensión en la ventana de Electron.
- `persistenceMiddleware` dispara un guardado completo del vault por cada acción cuyo tipo
  empiece con cualquiera de los prefijos de `MUTATING_ACTION_PREFIXES` — incluye `movements/`
  **y** `accounts/`, entre otros — salvo que el nombre de la acción empiece con `hydrate`
  (`src/store/middleware/persistenceMiddleware.ts:8-30,38-49`).
- Ya existen cuentas de tipo tarjeta con nombre "Banco Galicia" en los datos de demo
  (`src/store/vault/demoVaultData.ts:67,91`), confirmando que el dominio ya modela ese banco
  como emisor de tarjeta, no sólo de cuenta bancaria.
- El patrón de formulario compartido vigente es `FormSectionHeader` + `LeafButton` +
  `CategoryField`/`NumberField` (usados juntos en
  `src/modules/quickAdd/steps/StepAmountAndDetails.tsx:21-24,163-166,325-330`).
- No existe ningún directorio `specs/` previo en el repo — este es el primer spec bajo este
  flujo (`find specs -maxdepth 1` → "No such file or directory").
- **Estructura real de un resumen MP (PDF, medido en v9)**: tabla con columnas `Fecha`,
  `Descripción`, `ID de la operación`, `Valor`, `Saldo`; incluye movimientos de "Rendimientos"
  diarios (montos chicos) además de transferencias/débitos. Formato de fecha `dd-mm-yyyy`.
- **Estructura real de un resumen Galicia (tarjeta Visa, PDF, medido en v9)**: no es una tabla
  única — trae una sección `DETALLE DEL CONSUMO` (`FECHA | REFERENCIA | CUOTA | COMPROBANTE |
PESOS | DÓLARES`) repetida por cada titular/adicional de la tarjeta, más líneas sueltas fuera
  de esa tabla (saldo anterior, pago recibido, impuesto de sellos, intereses, IVA, percepciones
  IIBB) con fecha y monto en pesos. Formato de fecha `dd-mm-aa`. Algunas filas de consumo tienen
  columna `CUOTA` (ej. "05/06") indicando que el monto de la fila es una cuota, no el total de
  la compra. Existen filas con monto en la columna `DÓLARES` en vez de `PESOS` (a excluir, ver
  Supuesto 5). El archivo medido es de **tarjeta de crédito**; no se midió un resumen de
  Galicia de cuenta común/billetera.

**NO MEDIDO**:

- Formato real de columnas de un **export Excel/CSV** de Mercado Pago o de Banco Galicia —
  ambos archivos conseguidos son PDF (§5, Supuesto 1). No bloquea empezar `/speckit-plan` (el
  caso PDF, más complejo, ya está confirmado), pero sí bloquea cerrar esa combinación
  fuente×formato del alcance (§2) — se necesita un archivo real antes de darla por terminada.
- Formato real de un resumen de Banco Galicia de **cuenta común/billetera** (el archivo
  conseguido es de tarjeta de crédito) — mismo tratamiento que el punto anterior: no bloquea el
  plan, sí bloquea cerrar esa combinación.
- Volumen típico de filas por resumen mensual (para saber si hace falta paginar la
  previsualización) — no se preguntó ni se midió.
