# Revisión de specs/001-tablero-tareas/spec.md contra el código

## Cómo se midió, y qué quedó sin medir

Se abrió spec.md completo y .specify/memory/constitution.md v1.1.0. Se verificaron por lectura directa
todas las citas archivo:línea de §4 y §8: `electron/main/persistence/vaultPaths.ts` (22 líneas, match
exacto 4-22), `shared/ipcChannels.ts` (match 14-15), `electron/main/persistence/preferencesStore.ts`
(23 líneas, match 1-23), `electron/main/ipc/preferencesHandlers.ts` (14 líneas, match 1-14),
`shared/vaultEnvelope.types.ts` (match 11-15), `electron/preload/index.ts` (match 36-40 y 49),
`electron/main/index.ts` (match 29-47), `src/router/routes.ts` (patrón `/pagos`, `/deudas-y-prestamos`,
`/ajustes` confirmado), `git remote -v` (confirma `lautarocantero/MiHogar`), `electron.vite.config.ts`
(sin `envDir` para main, confirmado). También se confirmó existencia de `src/modules/*` (patrón por
feature), `src/components/shared/FormSectionHeader.tsx` y `LeafButton.tsx`, `src/store/categories/categoriesSlice.ts`
y `src/store/debts/` con `createEntityAdapter`, `src/store/middleware/persistenceMiddleware.ts` (prefijos
de acción mutante), `src/layout/Sidebar/useSidebarItems.ts` (existe, spec ya lo marca NO MEDIDO).

No medido: contenido de `/home/lautaro/Downloads/READMEdashboard.md` (fuente externa citada como "§7",
"§18", etc. — no está en el repo, no se puede verificar que diga lo que el spec afirma que dice, aunque
tampoco es una afirmación sobre el código de miHogar). Tampoco se corrió `gh api .../deployments`
(el spec mismo lo marca como NO MEDIDO y fuera de alcance, consistente).

## Crítico — el spec no se puede ejecutar como está

Ninguno. Todas las rutas de archivo, líneas, patrones de slice y componentes compartidos citados
resuelven y dicen lo que el spec afirma que dicen. No se encontró contradicción entre §2 (Alcance) y
§5/§6 (Supuestos/Preguntas abiertas): lo marcado "Dentro" en §2 no reaparece como supuesto sin resolver
en §5, y §6 explícitamente lista qué queda ajustable (supuestos 3, 4, 7) sin tratarlos como resueltos en
§2. Los acceptance criteria de §7 son ejecutables (comandos, pasos manuales con resultado esperado
concreto, sin "funciona bien" sin número). No hay violación del Principio I (No-Negotiable): el sync
lee de GitHub vía `fetch`, no envía datos financieros del hogar a ningún lado — las tareas del
tablero (bugs/deuda técnica del propio proyecto) no son "datos del hogar" en el sentido del Principio I,
y el token es de solo lectura, cargado explícitamente por el usuario.

## Importante — se puede ejecutar, pero va a doler

- **spec:186 cita mal `docs/pending.md`**: dice "leído completo, 434 palabras". `wc -w docs/pending.md`
  da 549 palabras. No cambia ninguna decisión de diseño (el spec no depende del conteo), pero es una
  cifra verificable que no coincide con el archivo real — indicio de que la lectura de discovery para
  ese archivo pudo quedar desactualizada o mal registrada. Vale re-contar antes de dar por buena esa
  entrada de "Contexto medido".
- **spec:128-131 apoya una decisión de arquitectura central (el sync nunca corre en el `useEffect` de
  montaje) en una cita a un README externo al repo** (`/home/lautaro/Downloads/READMEdashboard.md §18`),
  no verificable desde este árbol. No es grave porque la decisión en sí es sensata y consistente con
  Principio V (YAGNI, sin polling automático), pero technically la cita no "resuelve" contra el código
  de miHogar — es una referencia a un documento que no vive en el repo. Si ese README cambia o
  desaparece, la justificación documentada del supuesto 6 queda huérfana.

## Dudas — lo que no pude medir, y el comando que lo cierra

- Contenido exacto de `/home/lautaro/Downloads/READMEdashboard.md` en las secciones citadas (§6.1-C,
  §7, §8.2, §11, §12, §18): el spec ya no depende de código del repo para estas citas, así que no
  bloquea, pero si se quiere verificar fidelidad al README original, abrir ese archivo y comparar.
- Si GitHub Actions ya crea Deployments para `lautarocantero/MiHogar` (spec:191-194, ya marcado
  NO MEDIDO y fuera de alcance por el propio spec — cerrarlo con
  `gh api repos/lautarocantero/MiHogar/deployments` solo si se retoma la iteración de checks de entorno).
- Forma exacta de `useSidebarItems.ts` para insertar la entrada "Tareas" (spec:189-190, ya marcado
  NO MEDIDO por el propio spec, correcto dejarlo para implementación — el archivo existe, confirmado).

## Veredicto: PASS
