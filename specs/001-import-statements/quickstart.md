# Quickstart: validar la carga de boletas

Prerrequisitos: `yarn install` (con `xlsx` y `pdf-parse` agregados, ver `research.md`), vault
desbloqueado, al menos una cuenta común y una `CREDIT_CARD` (ej. "Visa Banco Galicia",
`demoVaultData.ts:67`).

## Setup

```bash
yarn typecheck && yarn lint
yarn dev
```

## Escenario 1 — MP (PDF), cuenta común

1. Ir a Pagos (`/pagos`) → botón "Importar boleta" → `/pagos/importar`.
2. Elegir fuente "Mercado Pago", cuenta destino una cuenta común.
3. Subir el PDF de ejemplo de MP.
4. Verificar: previsualización con fecha/monto/descripción por fila (incluye "Rendimientos").
5. Asignar categoría a todas las filas incluidas; confirmar.
6. **Esperado**: se crean los `Movement` (visibles en `PaymentsListPage` con filtro Pagados/Todos,
   no Pendientes — ver spec AC), y `AccountsPage` no cambia el `balance` de la cuenta.

## Escenario 2 — Galicia (PDF, tarjeta), cuenta `CREDIT_CARD`

1. Repetir el flujo eligiendo fuente "Banco Galicia", cuenta destino la tarjeta.
2. Subir el PDF de ejemplo de Galicia.
3. **Esperado**: la previsualización incluye consumos, pagos e impuestos/intereses (no sólo
   consumos); ninguna fila en dólares aparece; los consumos/impuestos quedan como `EXPENSE`, los
   pagos como `INCOME` (regla de signo invertida respecto a MP, `data-model.md` §5).
4. Confirmar. **Esperado**: `usedAmount` de la cuenta no cambia.

## Escenario 3 — guardado único (Supuesto 7)

1. Abrir DevTools de Chromium en la ventana de Electron (`Ctrl+Shift+I`/F12; habilitado en dev
   por `optimizer.watchWindowShortcuts`, `electron/main/index.ts:33`).
2. Agregar temporalmente `console.log(actionType)` justo después del guard
   `if (!actionType || !isMutatingAction(actionType))` en
   `src/store/middleware/persistenceMiddleware.ts:38-40` (no dentro de `isMutatingAction`).
3. Repetir el Escenario 1 completo.
4. **Esperado**: una sola línea `movements/addManyMovements` en consola — no
   `movements/.../pending`/`/fulfilled`, y no una línea por fila.

## Escenario 4 — deduplicación y edición

1. Repetir el Escenario 1 con el mismo PDF y la misma cuenta.
2. **Esperado**: todas las filas aparecen premarcadas como "probable duplicado" y excluidas por
   default.
3. Abrir un movimiento importado desde `EditMovementDialog`, cambiarle sólo la nota, guardar, y
   después borrarlo.
4. **Esperado**: el `balance`/`usedAmount` de la cuenta no cambia en ningún momento de este paso
   (confirma que `isImported` sobrevive a la edición, Supuesto 12).

## Escenario 5 — fila inválida

1. Con un fixture armado a partir del PDF de MP, forzar una fila con fecha imposible
   (`32-13-2026`) o un monto no numérico.
2. **Esperado**: el schema `parsedStatementRowSchema` (`data-model.md` §2) la rechaza antes de
   `dispatch`; el manejo puntual en la UI (excluir vs. marcar con error) es una decisión de
   implementación, no bloquea este AC.

## Fuera de este quickstart (diferido, sin archivo real — ver `data-model.md` §5)

- Excel/CSV de cualquier fuente.
- PDF de Banco Galicia cuenta común/billetera.

No se valida su comportamiento hasta conseguir un archivo de ejemplo real de esas combinaciones.
