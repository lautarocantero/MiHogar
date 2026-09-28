# Implementation Plan: Carga de boletas (import de movimientos)

**Branch**: `001-import-statements` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-import-statements/spec.md` (v13, `estado: aprobado`, `/spec-review` PASS sobre v12)

## Summary

Agregar un flujo de importación de boletas (Mercado Pago y Banco Galicia, PDF confirmado con
archivo real — Excel/CSV y Galicia cuenta común quedan diferidos, ver §5/§6/§8 del spec) que
parsea el archivo en el proceso main, muestra una previsualización editable (categoría +
inclusión) y crea `Movement[]` como registro histórico puro (sin efecto de saldo) vía un único
`dispatch(addManyMovements(...))`. Nuevo módulo `src/modules/importStatements`, reducer nuevo en
`movementsSlice.ts`, campo `isImported` en `movementSchema.ts`, dos IPC channels nuevos para
leer/parsear el archivo en main, y ajustes puntuales en `removeMovementThunk`/`updateMovementThunk`
para no aplicar efecto de saldo sobre movimientos importados.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Electron 33 (`electron-vite` 2, procesos
main/preload/renderer)

**Primary Dependencies**: React 18 + Redux Toolkit (`createEntityAdapter`), `react-hook-form` +
Zod (validación de bordes), MUI 6, `date-fns`. Nuevas para este feature (acotadas al proceso
main, Principio I): una librería de parseo de Excel/CSV (`xlsx`/`exceljs`, a elegir en Phase 0)
y una de extracción de texto de PDF (`pdf-parse` o similar, a elegir en Phase 0) — sólo para el
caso PDF confirmado en esta ronda (MP y Galicia tarjeta), Excel/CSV queda con el parser
implementado pero sin caso de prueba real todavía (spec §5 Supuesto 1, §8 NO MEDIDO).

**Storage**: vault cifrado local (JSON), vía `persistenceMiddleware` + `vaultFileSchema`. Sin
almacenamiento adicional: el archivo subido no se guarda, sólo las filas parseadas y luego los
`Movement` resultantes.

**Testing**: sin suite de tests automatizados en el repo (`yarn typecheck` + `yarn lint` +
verificación manual con `yarn dev`, mismo patrón que el resto de la app — ver AC del spec §7).

**Target Platform**: Electron desktop (Linux/Windows/macOS), mismo target que el resto de la app.

**Project Type**: desktop-app (Electron, monorepo interno main/preload/renderer, sin
frontend/backend separados).

**Performance Goals**: N/A explícito — parseo de un resumen mensual (decenas/pocos cientos de
filas, ver §8 NO MEDIDO "volumen típico") corre una sola vez por importación, sin streaming.

**Constraints**: Principio I (local-first: parseo en main, nunca se envía el archivo a un
servicio externo); Principio II (validación en el borde con Zod antes de `dispatch`); guardado
único del vault por importación (Supuesto 7 del spec).

**Scale/Scope**: un usuario/hogar por vault, importaciones manuales ocasionales (mensual, al
bajar el resumen). No hay multiusuario ni concurrencia a resolver.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Local-First (NON-NEGOTIABLE)** — PASS. El parseo de Excel/CSV/PDF corre en el proceso
  main (`electron/main/ipc/importStatementsHandlers.ts`, nuevo), igual que hoy
  `attachmentHandlers.ts` (`electron/main/ipc/attachmentHandlers.ts:7-19`). No se agrega ningún
  canal de red ni dependencia que llame a un servicio externo.
- **II. Validación en los bordes** — PASS con la misma salvedad que ya documenta el spec
  (Constitution Check, spec §"Constitution Check"): la previsualización no usa
  `react-hook-form` (precedente ya existente, `CategoryField.tsx` + `useState` en
  `StepAmountAndDetails.tsx:325-330`), pero sí hay dos schemas Zod nuevos en el borde
  (`src/validation/importedRowSchema.ts`, nuevo): uno para la fila recién parseada (sin
  `categoryId`) y otro para la fila ya confirmada (con `categoryId` obligatorio), este último
  corriendo justo antes del `dispatch` en `useImportMovements` (ver spec §4, pulido v13).
- **III. Arquitectura por módulo** — Se resuelve en este plan (era Pregunta abierta en spec §6):
  el feature vive en `src/modules/importStatements/` (componentes de previsualización, el hook
  `useImportMovements`, y el mapeo columnas→fila por fuente). No lee ni muta el estado de otro
  módulo directamente: usa `selectAllAccounts` (`src/store/accounts`, mismo selector que
  `StepAmountAndDetails.tsx:60`) y `movementsSelectors` (`src/store/movements/movementsSlice.ts:25`)
  para el chequeo de duplicados, y despacha `addManyMovements` (acción del slice `movements`, no
  estado interno de otro módulo).
- **IV. Consistencia de UI** — PASS. Reusa `CategoryField`, `FormSectionHeader`, `LeafButton` (ya
  usados en `StepAmountAndDetails.tsx:21-24,163-166,325-330`) para la pantalla de
  previsualización y el punto de entrada.
- **V. YAGNI** — PASS. Una sola librería de Excel/CSV y una de PDF, acotadas a este flujo (spec
  §5 Supuesto 3); ningún backend ni cola nueva.
- **Restricciones tecnológicas** — PASS. Mismo stack; sólo se suman las dos dependencias de
  parseo mencionadas arriba.

**Resultado**: sin violaciones. No hace falta Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-import-statements/
├── spec.md               # v13, aprobado, PASS
├── spec-review.md        # última ronda: PASS sobre v12
├── plan.md               # este archivo
├── research.md           # Phase 0
├── data-model.md         # Phase 1
├── quickstart.md         # Phase 1
├── contracts/
│   └── import-statements-ipc.md   # Phase 1: contrato de los canales IPC nuevos
└── tasks.md               # Phase 2 (/speckit-tasks, no generado acá)
```

### Source Code (repository root)

Proyecto Electron único (no hay opción "frontend/backend" separados: `electron/main`,
`electron/preload`, `src/` renderer, `shared/` tipos compartidos). Estructura nueva/tocada por
este feature:

```text
electron/
└── main/
    ├── ipc/
    │   └── importStatementsHandlers.ts       # nuevo: registra los 2 canales IPC de parseo
    └── persistence/
        └── statementParsers/                  # nuevo: un parser por fuente×formato
            ├── mercadoPagoPdfParser.ts         # confirmado (archivo real medido)
            ├── mercadoPagoExcelParser.ts       # implementado, sin archivo real (diferido)
            ├── galiciaTarjetaPdfParser.ts      # confirmado (archivo real medido)
            └── galiciaExcelParser.ts           # implementado, sin archivo real (diferido)

electron/preload/
└── index.ts                                   # se agrega `importStatementsApi` (patrón attachmentsApi)

shared/
├── ipcChannels.ts                              # + IMPORT_STATEMENTS_PARSE, IMPORT_STATEMENTS_OPEN_FILE
└── vaultEnvelope.types.ts                      # + tipos de payload/resultado del parseo (si aplica)

src/
├── validation/
│   ├── movementSchema.ts                       # + isImported?: z.boolean().optional()
│   └── importedRowSchema.ts                    # nuevo: schema de fila parseada + schema de fila confirmada
├── store/movements/
│   ├── movementsSlice.ts                       # + reducer addManyMovements (movementsAdapter.addMany)
│   └── movementThunks.ts                       # removeMovementThunk/updateMovementThunk: skip balance si isImported
├── modules/importStatements/                   # nuevo módulo del feature
│   ├── ImportStatementsPage.tsx                # o diálogo, según Phase 1 (decisión de punto de entrada abajo)
│   ├── useImportMovements.ts                   # hook plano: arma rows y hace 1 solo dispatch
│   ├── components/
│   │   ├── SourceAndAccountStep.tsx            # elegir fuente + cuenta destino (selectAllAccounts)
│   │   └── ImportPreviewTable.tsx              # tabla editable: categoría + inclusión + aviso duplicado
│   └── typings/
│       └── importStatements.types.ts
├── modules/payments/
│   └── PaymentsListPage.tsx                    # + botón "Importar boleta" (punto de entrada)
└── router/
    ├── routes.ts                                # + IMPORT_STATEMENTS: '/pagos/importar'
    └── AppRouter.tsx                            # + <Route path={ROUTES.IMPORT_STATEMENTS} .../>
```

**Structure Decision**: módulo nuevo `src/modules/importStatements` (Principio III), sin tocar
la arquitectura existente. El punto de entrada (Pregunta abierta del spec §6) se resuelve como
un botón en `PaymentsListPage` (donde ya vive el timeline de movimientos,
`PaymentsListPage.tsx:20-21,312`) que navega a una ruta propia `/pagos/importar`
(`ImportStatementsPage`), en vez de un paso extra en Quick Add o un diálogo modal — mantiene el
flujo de varios pasos (fuente+cuenta → subir archivo → previsualización) fuera del modal de
carga rápida existente, sin competir con su propio wizard.

## Complexity Tracking

_Sin violaciones de la constitución — tabla no aplica._
