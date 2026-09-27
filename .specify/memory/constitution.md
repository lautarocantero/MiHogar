<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: N/A (initial adoption, no prior ratified version)
- Added sections:
  - Core Principles: I. Local-First y Privacidad por Diseño; II. Seguridad de Tipos y
    Validación en los Bordes; III. Arquitectura por Módulo de Feature; IV. Consistencia
    de UI Compartida; V. Simplicidad y Alcance Acotado (YAGNI)
  - Restricciones Tecnológicas
  - Flujo de Trabajo de Desarrollo (Spec-Driven Development)
  - Governance
- Removed sections: none (initial adoption)
- Follow-up TODOs: none
-->

# Mi Hogar Constitution

## Core Principles

### I. Local-First y Privacidad por Diseño (NON-NEGOTIABLE)
Todos los datos del hogar (cuentas, pagos, movimientos, ahorros, deudas, adjuntos) viven
únicamente en el vault cifrado local del usuario. La app MUST NOT introducir un backend,
sincronización en la nube, ni el envío de datos del hogar a servicios de terceros. Toda
nueva integración externa (por ejemplo Google Calendar, en `docs/pending.md`) MUST tratar
los datos del hogar como algo que no sale del dispositivo salvo acción explícita e
informada del usuario.
**Rationale**: es la propuesta de valor central de la app — finanzas domésticas sin
exponer información sensible a un tercero ni depender de un servidor.

### II. Seguridad de Tipos y Validación en los Bordes
TypeScript strict (`strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters` en
`tsconfig.web.json`/`tsconfig.node.json`) MUST mantenerse sin relajar. Toda entrada de
usuario MUST validarse en el formulario (`react-hook-form` + Zod/Yup en
`src/validation/*`) antes de llegar a un `dispatch`; los reducers y thunks de Redux
pueden asumir que los datos que reciben ya son válidos.
**Rationale**: no hay backend que valide de nuevo los datos. El límite de confianza es el
formulario; debilitarlo corrompe datos financieros en silencio — ya ocurrió con montos
negativos aceptados y el separador decimal roto para formato es-AR (`docs/pending.md`).

### III. Arquitectura por Módulo de Feature
Cada feature vive en su propio módulo bajo `src/modules/<feature>` (componentes, hooks y
lógica de dominio propia). El estado compartido vive en slices de `src/store/<feature>`
usando `createEntityAdapter` de Redux Toolkit. Un módulo MUST NOT leer ni mutar el estado
interno de otro módulo directamente: pasa por selectors/actions del store o por helpers
de dominio en `src/utils/domain`.
**Rationale**: la app crece agregando features. Mezclar responsabilidades entre módulos
ya generó bugs cross-feature (referencias colgantes al borrar una cuenta que quedan en
pagos/movimientos/tarjetas — `docs/audit-crud-gaps.md`).

### IV. Consistencia de UI Compartida
Los formularios y layouts MUST reutilizar los componentes compartidos ya establecidos
(`FormSectionHeader`, `LeafButton`, y el resto de `src/components/shared`) en vez de
reimplementar variantes ad hoc por módulo. Cambios transversales de UI (theming, tamaños,
tipografía) se hacen en `src/theme` y se propagan; MUST NOT hardcodearse por pantalla.
**Rationale**: la unificación reciente de formularios (`FormSectionHeader`/`LeafButton`)
existió específicamente para eliminar duplicación; nuevas features deben mantener esa
consistencia en vez de revertirla.

### V. Simplicidad y Alcance Acotado (YAGNI)
Mi Hogar es mantenida por un solo desarrollador. El proyecto MUST NOT incorporar
infraestructura (backend, colas, microservicios, capas de abstracción genéricas) que no
resuelva una necesidad ya documentada en un spec o en `docs/pending.md`. Ante una nueva
necesidad, SHOULD preferirse extender el patrón existente (slice + módulo) antes que
introducir una abstracción nueva para un solo caso de uso.
**Rationale**: evitar sobre-ingeniería en una app de alcance doméstico; cada capa nueva
es carga de mantenimiento adicional para un solo mantenedor.

## Restricciones Tecnológicas

El stack MUST mantenerse: Electron + `electron-vite` (procesos main/preload/renderer),
React 18 + TypeScript, Redux Toolkit + `react-redux` para estado global, React Router
(`HashRouter`) para ruteo, MUI + MUI X Charts para UI y gráficos, `react-hook-form` +
Zod/Yup para formularios, `date-fns` para manejo de fechas, y el módulo `crypto` de Node
(proceso main) para derivar la clave y cifrar/descifrar el vault. No se introduce un
framework de UI, gestor de estado o motor de persistencia alternativo sin una enmienda a
esta constitución que justifique el cambio.

## Flujo de Trabajo de Desarrollo (Spec-Driven Development)

Toda feature nueva (no un bugfix trivial de una línea) MUST seguir el flujo de Spec Kit:
`/speckit-specify` → (`/speckit-clarify` opcional) → `/speckit-plan` →
(`/speckit-checklist` opcional) → `/speckit-tasks` → (`/speckit-analyze` opcional) →
`/speckit-implement` → `/speckit-converge`. Cada spec y su plan viven en
`specs/<NNN>-<slug>/` y se versionan en git junto con el código. Las ramas de feature
siguen la convención `<NNN>-feature/<slug>` ya usada en el repo (ver
`001-feature/solve-details`). Antes de mergear a `main`, `yarn lint`, `yarn typecheck` y
`yarn format` MUST pasar sin errores. Bugs y pendientes conocidos se registran en
`docs/pending.md` hasta que se conviertan en un spec propio.

## Governance

Esta constitución prevalece sobre cualquier convención no escrita del proyecto. Las
enmiendas se hacen exclusivamente vía `/speckit-constitution`, documentando el Sync
Impact Report correspondiente. Versionado semántico: MAJOR para eliminación o
redefinición incompatible de un principio, MINOR para principios nuevos o expansión
material de una sección existente, PATCH para aclaraciones o correcciones de redacción.
Todo spec y plan generado MUST incluir una verificación de cumplimiento de esta
constitución en su sección "Constitution Check".

**Version**: 1.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-09-27
