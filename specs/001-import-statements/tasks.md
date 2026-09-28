---
description: 'Task list for Carga de boletas (001-import-statements)'
---

# Tasks: Carga de boletas (import de movimientos)

**Input**: Design documents from `/specs/001-import-statements/`

**Prerequisites**: plan.md, spec.md (v13, `estado: aprobado`), research.md, data-model.md,
contracts/import-statements-ipc.md, quickstart.md

**Tests**: no se generan tareas de test automatizado — el repo no tiene suite de tests (spec §7,
plan.md "Testing"); la validación es manual vía `quickstart.md` + `yarn typecheck`/`yarn lint`.

**Organización**: por historia de usuario, derivadas del spec (no traía P1/P2/P3 explícito —
se derivan de §2/§3/§7 del spec, en orden de lo que tiene AC verificable primero).

## Historias de usuario

- **US1 (P1, MVP)**: Importar una boleta de Mercado Pago (PDF) contra una cuenta común y ver los
  movimientos creados, sin afectar el saldo. Caso con archivo real confirmado (spec §5 Supuesto
  1).
- **US2 (P2)**: Importar un resumen de tarjeta de crédito de Banco Galicia (PDF) contra una
  cuenta `CREDIT_CARD`, incluyendo consumos/pagos/impuestos con la regla de signo invertida y
  filtrando filas en dólares. Caso con archivo real confirmado.
- **US3 (P3)**: Editar o borrar un movimiento importado sin que se aplique/revierta efecto de
  saldo, sin importar qué campo se cambie. Depende de que exista al menos un movimiento
  importado (US1 o US2), pero es una capacidad verificable por separado.
- **US4 (P4, diferido)**: Parsers de Excel/CSV (ambas fuentes) y de Galicia cuenta común en PDF.
  Sin archivo real medido (spec §5 Supuesto 1, §8 NO MEDIDO) — implementación de mejor esfuerzo,
  **sin AC verificable** todavía. No bloquea el resto de la feature.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

**Purpose**: dependencias nuevas y estructura de carpetas compartida por todas las historias.

- [x] T001 Agregar `xlsx` y `pdf-parse` a `dependencies` en `package.json` y correr `yarn
install` (research.md §1-2)
- [x] T002 [P] Crear `electron/main/persistence/statementParsers/` con `index.ts` exportando un
      `resolveParser(source, format)` que por ahora lanza "no implementado" (se completa por
      historia)
- [x] T003 [P] Crear `src/modules/importStatements/` con subcarpetas `components/` y `typings/`
      (barrel `index.ts` vacío, `typings/importStatements.types.ts` con `StatementSource`/
      `StatementFileFormat` re-exportados de `shared/vaultEnvelope.types.ts`)

**Checkpoint**: estructura lista, sin lógica todavía.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: piezas que TODAS las historias necesitan (schema, reducer, IPC, ruteo, punto de
entrada). Ninguna historia se puede probar de punta a punta sin esto.

**⚠️ CRITICAL**: no arrancar Phase 3+ sin terminar esta fase.

- [x] T004 Agregar `isImported: z.boolean().optional()` a `movementSchema` en
      `src/validation/movementSchema.ts:4-17` (data-model.md §1)
- [x] T005 [P] Agregar reducer `addManyMovements` (usa `movementsAdapter.addMany`) a
      `src/store/movements/movementsSlice.ts:5-7`
- [x] T006 [P] Agregar canales `IMPORT_STATEMENTS_PICK_FILE` e `IMPORT_STATEMENTS_PARSE` a
      `shared/ipcChannels.ts` (contracts/import-statements-ipc.md)
- [x] T007 [P] Agregar tipos `StatementSource`, `StatementFileFormat`, `ParseStatementPayload`,
      `ParsedStatementRowDto`, `ParseStatementResult` a `shared/vaultEnvelope.types.ts`
      (contracts/import-statements-ipc.md)
- [x] T008 Crear `electron/main/ipc/importStatementsHandlers.ts` con
      `registerImportStatementsHandlers()` (handler `IMPORT_STATEMENTS_PICK_FILE` con
      `dialog.showOpenDialog`, handler `IMPORT_STATEMENTS_PARSE` delegando a
      `resolveParser(...).parse(...)` de T002) y registrarlo donde se registran el resto de los
      handlers (junto a `registerAttachmentHandlers()`)
- [x] T009 [P] Agregar `importStatementsApi` (`pickFile`, `parse`) a `electron/preload/index.ts`,
      expuesto vía `contextBridge.exposeInMainWorld('importStatementsApi', ...)`, mismo patrón que
      `attachmentsApi` (`electron/preload/index.ts:27-32`)
- [x] T010 [P] Crear `src/validation/importedRowSchema.ts` con `parsedStatementRowSchema` — `date`
      debe matchear `yyyy-MM-dd` **y** ser una fecha de calendario real (mes 01-12, día válido para
      ese mes/año, con `date-fns` `isValid(parseISO(value))`, no sólo un regex de forma — ver
      data-model.md §2 pulido v13), `amount: z.number().finite()` con `.refine((n) => n !== 0, 'Monto
no puede ser 0')`, `description: z.string().min(1)`, `sourceRef` opcional
- [x] T011 [P] En el mismo archivo, agregar `confirmedStatementRowSchema =
parsedStatementRowSchema.extend({ categoryId: z.string().min(1), accountId: z.string().min(1),
type: z.nativeEnum(MovementType), ownerType: z.nativeEnum(OwnerType), ownerId:
z.string().optional() })` — `categoryId` es obligatorio acá, a diferencia del schema de fila
      parseada (data-model.md §3, spec Supuesto 4)
- [x] T012 Agregar `IMPORT_STATEMENTS: '/pagos/importar'` a `src/router/routes.ts` y la ruta
      lazy-loaded `<Route path={ROUTES.IMPORT_STATEMENTS} element={<ImportStatementsPage />} />` en
      `src/router/AppRouter.tsx` (mismo patrón que el resto de las rutas lazy, `AppRouter.tsx:6-40`)
- [x] T013 Agregar botón "Importar boleta" en `src/modules/payments/PaymentsListPage.tsx`
      (`LeafButton`, cerca de donde ya vive el timeline, `PaymentsListPage.tsx:20-21,312`) que navega
      a `ROUTES.IMPORT_STATEMENTS`

**Checkpoint**: infraestructura lista — cualquier historia de usuario puede implementarse ahora.

---

## Phase 3: User Story 1 - Importar boleta de Mercado Pago (PDF) (Priority: P1) 🎯 MVP

**Goal**: subir el PDF de ejemplo de MP contra una cuenta común, revisar la previsualización,
categorizar y confirmar — crea los `Movement` sin afectar `balance`.

**Independent Test**: quickstart.md "Escenario 1" — completo de punta a punta sin depender de
US2/US3/US4.

### Implementation for User Story 1

- [x] T014 [P] [US1] Implementar `mercadoPagoPdfParser.ts` en
      `electron/main/persistence/statementParsers/`: extrae texto con `pdf-parse`, reconoce filas por
      el patrón `dd-mm-yyyy` + descripción + ID de operación + `$ <monto>` + `$ <saldo>` (data-model.md
      §5 "Mercado Pago"), normaliza `date` a `yyyy-MM-dd`, devuelve `ParsedStatementRowDto[]` con
      `amount` en el signo original del archivo (research.md §4)
- [x] T015 [US1] Registrar `mercadoPagoPdfParser` en `resolveParser` (T002) para
      `source === 'MERCADO_PAGO' && format === 'PDF'`
- [x] T016 [P] [US1] Crear `SourceAndAccountStep.tsx` en
      `src/modules/importStatements/components/`: selector de fuente (MP/Galicia) + selector de
      cuenta destino usando `selectAllAccounts` (mismo selector que
      `StepAmountAndDetails.tsx:60`)
- [x] T017 [P] [US1] Crear `ImportPreviewTable.tsx` en `src/modules/importStatements/components/`:
      tabla con fecha/monto/descripción por fila, `CategoryField` editable, checkbox de inclusión, y
      aviso visual de "probable duplicado" — estado plano por fila (`useState`), sin
      `react-hook-form` (spec Supuesto 13)
- [x] T018 [US1] Crear `checkDuplicateRow.ts` en `src/modules/importStatements/`: compara
      `date` (string `yyyy-MM-dd`) + `amount` (valor absoluto) + `type` + `accountId` contra
      `movementsSelectors` (`src/store/movements/movementsSlice.ts:25`) para marcar una fila como
      probable duplicado (spec Supuesto 9)
- [x] T019 [US1] Crear `useImportMovements.ts` en `src/modules/importStatements/`: orquesta
      `window.importStatementsApi.pickFile()` → `.parse(...)` → valida cada fila contra
      `parsedStatementRowSchema` (T010, descarta/marca las que no matchean) → arma el estado de
      previsualización (con `checkDuplicateRow` de T018 pre-marcando exclusión) → al confirmar, mapea
      cada fila incluida a `ConfirmedStatementRow` (con la regla de signo de MP: positivo →
      `MovementType.INCOME`, negativo → `MovementType.EXPENSE`, y `Math.abs(amount)` — data-model.md
      §4) → valida contra `confirmedStatementRowSchema` (T011) → un solo
      `dispatch(addManyMovements(rows))` (T005)
- [x] T020 [US1] Crear `ImportStatementsPage.tsx` en `src/modules/importStatements/`: wizard de 3
      pasos (`SourceAndAccountStep` → subir archivo vía `pickFile` → `ImportPreviewTable`), usando
      `FormSectionHeader`/`LeafButton` (Principio IV), botón de confirmar deshabilitado mientras
      alguna fila incluida no tenga `categoryId` (spec Supuesto 4)

**Checkpoint**: US1 completo y testeable de forma independiente (quickstart Escenario 1).

---

## Phase 4: User Story 2 - Importar resumen de tarjeta Banco Galicia (PDF) (Priority: P2)

**Goal**: subir el PDF de ejemplo de Galicia (tarjeta) contra una cuenta `CREDIT_CARD`; la
previsualización incluye consumos, pagos e impuestos/intereses, filtra filas en dólares, y
aplica la regla de signo invertida respecto a MP.

**Independent Test**: quickstart.md "Escenario 2" — no requiere tocar código de US1 más allá de
reusar `useImportMovements`/`ImportPreviewTable`/`checkDuplicateRow` ya creados.

### Implementation for User Story 2

- [x] T021 [P] [US2] Implementar `galiciaTarjetaPdfParser.ts` en
      `electron/main/persistence/statementParsers/`: reconoce la sección `DETALLE DEL CONSUMO`
      (`FECHA dd-mm-aa | REFERENCIA | CUOTA opcional | COMPROBANTE | PESOS | DÓLARES`, para cualquier
      titular/adicional) y las líneas sueltas de saldo anterior/pago/impuestos/intereses/percepciones
      (data-model.md §5 "Galicia"), interpreta el año de 2 dígitos como `20aa`, **descarta** toda fila
      cuyo monto esté en la columna `DÓLARES` (spec Supuesto 5) antes de devolver
      `ParsedStatementRowDto[]`
- [x] T022 [US2] Registrar `galiciaTarjetaPdfParser` en `resolveParser` (T002) para
      `source === 'GALICIA' && format === 'PDF'`
- [x] T023 [US2] En `useImportMovements.ts` (T019), aplicar la regla de signo por fuente al mapear
      a `ConfirmedStatementRow`: Galicia invierte MP — positivo → `MovementType.EXPENSE`, negativo →
      `MovementType.INCOME` (data-model.md §5, spec §3 paso 6) — parametrizar por `source`, no
      hardcodear la regla de MP
- [x] T024 [US2] Verificar en `SourceAndAccountStep.tsx` (T016) que `selectAllAccounts` no
      filtra cuentas `CREDIT_CARD` — deben aparecer como destino válido igual que una cuenta común

**Checkpoint**: US1 + US2 funcionan de forma independiente (quickstart Escenarios 1 y 2).

---

## Phase 5: User Story 3 - Editar/borrar un movimiento importado sin afectar saldo (Priority: P3)

**Goal**: borrar o editar (fecha, monto, tipo, cuenta) un movimiento con `isImported: true` nunca
aplica ni revierte efecto de saldo, y `isImported` sobrevive a la edición.

**Independent Test**: quickstart.md "Escenario 4" — requiere al menos un movimiento importado
(de US1 o US2) ya creado, pero el cambio en sí es independiente de qué parser lo generó.

### Implementation for User Story 3

- [x] T025 [US3] En `removeMovementThunk` (`src/store/movements/movementThunks.ts:83-115`), no
      llamar `applyMovementBalanceEffect` cuando `movement.isImported === true` (spec Supuesto 12)
- [x] T026 [US3] En `updateMovementThunk` (mismo archivo), no llamar `applyMovementBalanceEffect`
      cuando `oldMovement.isImported === true` (ni al revertir el viejo ni al aplicar el nuevo), y
      forzar `newMovement.isImported = oldMovement.isImported` al armar `newMovement`
      (`movementThunks.ts:95`, hoy `{ ...input.changes, id: input.id }`) — **no** confiar en
      `input.changes.isImported`

**Checkpoint**: US1, US2 y US3 funcionan juntos e independientemente (quickstart Escenario 4).

---

## Phase 6: User Story 4 - Parsers diferidos (Excel/CSV, Galicia cuenta común) (Priority: P4)

**Goal**: cobertura de mejor esfuerzo para las combinaciones sin archivo real (spec §5 Supuesto
1, §8 NO MEDIDO). **Sin AC verificable** — no bloquea ni se considera terminado el resto de la
feature si esta fase queda pendiente.

**Independent Test**: ninguno formal todavía — sólo `yarn typecheck`/`yarn lint`. Se cierra
cuando se consiga un archivo de ejemplo real de cada combinación (ver spec §6).

### Implementation for User Story 4

- [x] T027 [P] [US4] Implementar `mercadoPagoExcelParser.ts` en
      `electron/main/persistence/statementParsers/` usando `xlsx` (`XLSX.read` +
      `XLSX.utils.sheet_to_json`), con el mapeo de columnas asumido en spec §5 Supuesto 1
      (fecha/monto/descripción) — comentario en el código marcando que es sin confirmar
- [x] T028 [P] [US4] Implementar `galiciaExcelParser.ts` en el mismo directorio, mismo criterio
      ("sin confirmar")
- [x] T029 [US4] Registrar ambos en `resolveParser` (T002) para `format === 'EXCEL_CSV'`; para
      `source === 'GALICIA' && format === 'PDF'` contra una cuenta común (no tarjeta), reusar
      `galiciaTarjetaPdfParser` (T021) como mejor suposición y dejar un comentario explícito de que no
      está confirmado contra un archivo real de ese caso

**Checkpoint**: las 4 combinaciones fuente×formato del alcance (§2) tienen algún parser, aunque
2 de ellas (Excel/CSV ambas fuentes, Galicia cuenta común) sigan sin AC verificable.

---

## Phase 7: Polish & Cross-Cutting

**Purpose**: cierre de la feature.

- [x] T030 [P] Correr `quickstart.md` Escenarios 1-5 completos con `yarn dev` — corrido con
      `yarn build` + Playwright (`_electron`) controlando la app real en modo demo (sin tocar el
      vault real), stubeando `dialog.showOpenDialog` para apuntar a los PDFs reales del usuario
      (`pdf_260927185229.pdf` = MP, `Resumen Agosto 2026-exported.pdf` = Galicia tarjeta). Script
      no forma parte del repo (`.e2e-scratch/`, gitignored).
      - Escenario 1 (MP, cuenta común): 51 filas en previsualización, incluye "Rendimientos",
        categorización habilita "Confirmar", importación crea los `Movement` y el balance de
        "Cuentas y tarjetas" no cambia.
      - Escenario 2 (Galicia tarjeta): 30 filas, ninguna en dólares, importación confirma y el
        `usedAmount` de la tarjeta no cambia.
      - Escenario 3 (guardado único): verificado por lectura de código en vez de DevTools —
        `useImportMovements.confirm` hace un solo `dispatch(addManyMovements(movements))`
        (`src/modules/importStatements/useImportMovements.ts`), no un dispatch por fila.
      - Escenario 4 (dedup + editar/borrar): reimportar el mismo PDF de MP marca las 51 filas
        como "Probable duplicado" y las excluye por default; se editó la nota de un movimiento
        importado y se borró, sin cambios en el balance en ningún paso (confirma que
        `isImported` sobrevive a la edición). Nota: el filtro "Estado" de `PaymentsListPage` es
        estado local del componente y se resetea a "Pendientes" al navegar a otra página y
        volver — comportamiento esperado, no bug; hay que reaplicar "Todos" tras volver.
      - Escenario 5 (fila inválida): verificado por lectura de código —
        `parsedStatementRowSchema` (`src/validation/importedRowSchema.ts`) rechaza fecha con
        formato inválido (regex `^\d{4}-\d{2}-\d{2}$`) y monto no numérico/0 antes de cualquier
        dispatch.
- [x] T031 Correr `yarn typecheck`, `yarn lint` y `yarn format` sin errores
- [x] T032 Actualizar `docs/pending.md` sacando la entrada "Carga de boletas" (`docs/pending.md:28`)
      y anotando ahí, si corresponde, el punto pendiente de US4 (archivos de ejemplo faltantes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Phase 1 — bloquea todas las historias.
- **US1 (Phase 3)**: depende de Foundational. Sin dependencia de otras historias.
- **US2 (Phase 4)**: depende de Foundational. Reusa componentes de US1 (T016-T019) — implementar
  después de US1 en la práctica, aunque no dependa de su lógica de negocio específica.
- **US3 (Phase 5)**: depende de Foundational (el campo `isImported`, T004). Para probarse
  necesita al menos un movimiento importado de US1 o US2, pero el cambio de código en sí no
  depende de ninguna de las dos.
- **US4 (Phase 6)**: depende de Foundational y de `resolveParser` (T002). Independiente de
  US1/US2/US3 en código; reusa el parser de US2 (T021) como fallback de mejor esfuerzo.
- **Polish (Phase 7)**: depende de todas las historias que se decida incluir en el alcance de
  esta ronda de implementación (mínimo US1+US2+US3; US4 es diferible).

### Parallel Opportunities

- T002, T003 (Setup) en paralelo.
- T005, T006, T007, T009, T010, T011 (Foundational) en paralelo entre sí (archivos distintos).
- T014, T016, T017 (US1) en paralelo.
- T021 (US2) en paralelo con cualquier tarea de US1 que no toque `useImportMovements.ts`.
- T027, T028 (US4) en paralelo.

## Implementation Strategy

### MVP First (US1 solamente)

1. Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1).
2. Validar con quickstart.md Escenario 1.
3. Ahí ya hay una importación end-to-end funcional para Mercado Pago.

### Incremental Delivery

1. Setup + Foundational.
2. US1 (MVP) → validar → esto ya es demostrable.
3. US2 → validar (Escenario 2) → cubre Galicia tarjeta.
4. US3 → validar (Escenario 4) → cierra el riesgo de saldo inflado al editar/borrar.
5. US4 (opcional/diferible) → sin AC hasta conseguir archivos de ejemplo reales.
6. Polish → typecheck/lint/format + actualizar `docs/pending.md`.
