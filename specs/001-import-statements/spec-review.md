# Revisión de specs/001-import-statements/spec.md contra el código

> Última ronda ejecutada contra el spec v12. Veredicto: **PASS**. La v13 (posterior) es pulido
> de 3 de los 4 hallazgos "Importante" de esta ronda, sin cambios de diseño — no se volvió a
> correr `/spec-review` sobre ella (mismo criterio que v7→v8).

## Cómo se midió, y qué quedó sin medir

Se abrieron todas las citas `archivo:línea` del spec contra el árbol actual (`movementThunks.ts`,
`movementsSlice.ts`, `persistenceMiddleware.ts`, `movementSchema.ts`, `useUpdateMovement.ts`,
`useCreatePayment.ts`, `quickAddFormSchema.ts`, `accountSchema.ts`, `demoVaultData.ts`,
`PaymentsListPage.tsx`, `StepAmountAndDetails.tsx`, `CategoryField.tsx`, `ipcChannels.ts`,
`attachmentHandlers.ts`, `attachmentsStorage.ts`, `electron/main/index.ts`, `store/index.ts`,
`AttachmentList.tsx`, `docs/pending.md`, `package.json`) y todas resuelven y dicen lo que el spec
afirma. Se confirmó además que `Movement = z.infer<typeof movementSchema>`
(`src/typings/domain/types.ts:24`) y que `vaultFileSchema.ts:19` usa `movementSchema`, así que
`isImported` se tipa y sobrevive al guardado/recarga del vault; y que `persistenceMiddleware`
cuenta `movements/addManyMovements` como una sola acción mutante (confirma el guardado único,
Supuesto 7).

Quedó sin medir: el contenido real de los PDF de MP y Galicia (no están versionados) y el
comportamiento en runtime (un guardado por importación, que el saldo no cambie).

## Crítico — el spec no se puede ejecutar como está

Ninguno.

## Importante — se puede ejecutar, pero va a doler

1. El AC de edición/borrado no aclaraba que hay que cambiar el filtro de `PaymentsListPage` a
   Pagados/Todos para ver un movimiento importado (el default es `PENDING`). **Corregido en
   v13.**
2. `categoryId` obligatorio sólo lo garantizaba el botón de confirmar deshabilitado, no un
   schema — un dato inválido llegando al reducer viola que "los reducers asumen datos válidos"
   (`constitution.md:33-35`). **Corregido en v13**: `useImportMovements` valida las filas
   confirmadas contra un schema con `categoryId` obligatorio antes de dispatchear.
3. El schema Zod de `date` validaba sólo la forma (`\d{4}-\d{2}-\d{2}`), no que fuera una fecha
   de calendario real — el AC de fila inválida (fecha imposible) no disparaba. **Corregido en
   v13.**
4. Excel/CSV (ambas fuentes) y Galicia cuenta común están en el alcance (§2) sin ningún AC. No
   es contradicción — el spec lo reconoce en §5/§6/§8 — pero `/speckit-plan` debe marcarlas
   explícitamente como diferidas hasta conseguir esos archivos de ejemplo.

## Veredicto: PASS

Sin críticos. Siguiente paso: `/speckit-plan`, con Excel/CSV (ambas fuentes) y Galicia cuenta
común marcadas como diferidas hasta conseguir archivos de ejemplo reales de esas combinaciones.
