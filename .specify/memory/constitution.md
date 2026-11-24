<!--
Sync Impact Report
- Version change: 1.1.0 → 2.0.0
- Modified principles:
  - I. "Local-First y Privacidad por Diseño" → "Privacidad por Diseño — Cifrado de Punta a Punta":
    se permite un backend (Supabase) para sincronizar entre dispositivos, siempre que solo reciba
    datos ya cifrados en el cliente con la clave del hogar.
  - V. Simplicidad: se aclara que el backend permitido es un BaaS administrado, sin servidor propio.
- Modified sections:
  - Restricciones Tecnológicas: la app pasa a ser web (Vite) + escritorio (Electron) con la misma
    UI; el cifrado se hace con WebCrypto en el cliente; se suma Supabase.
- Removed sections: none
- Follow-up TODOs: none (ver specs/002-web-app/spec.md)
-->

# Mi Hogar Constitution

## Core Principles

### I. Privacidad por Diseño — Cifrado de Punta a Punta (NON-NEGOTIABLE)

Los datos del hogar (cuentas, pagos, movimientos, ahorros, deudas, adjuntos) MUST cifrarse en el
dispositivo del usuario, con una clave derivada de la clave del hogar, antes de salir de él. El
único backend permitido es Supabase (auth + Postgres + Storage), usado para identificar la cuenta
y guardar blobs cifrados; MUST NOT recibir datos del hogar en claro ni la clave del hogar. Toda
nueva integración externa (por ejemplo Google Calendar, en `docs/pending.md`) MUST tratar los
datos del hogar como algo que no sale del dispositivo sin cifrar salvo acción explícita e
informada del usuario.
**Rationale**: la propuesta de valor es tener las finanzas en todos los dispositivos sin exponer
información sensible a un tercero: el proveedor guarda datos que no puede leer.

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
infraestructura (servidores propios, colas, microservicios, capas de abstracción genéricas)
que no resuelva una necesidad ya documentada en un spec o en `docs/pending.md`; el backend se
limita a servicios administrados de Supabase. Ante una nueva
necesidad, SHOULD preferirse extender el patrón existente (slice + módulo) antes que
introducir una abstracción nueva para un solo caso de uso.
**Rationale**: evitar sobre-ingeniería en una app de alcance doméstico; cada capa nueva
es carga de mantenimiento adicional para un solo mantenedor.

## Restricciones Tecnológicas

El stack MUST mantenerse: una única UI React 18 + TypeScript que se compila como web app (Vite)
y como app de escritorio (Electron + `electron-vite`, que carga la misma UI); Redux Toolkit +
`react-redux` para estado global, React Router (`HashRouter`) para ruteo, MUI + MUI X Charts para
UI y gráficos, `react-hook-form` + Zod/Yup para formularios, `date-fns` para fechas, WebCrypto
(`crypto.subtle`) en el cliente para derivar la clave y cifrar/descifrar el vault (formato
`VaultEnvelope` v1, compatible con los respaldos de escritorio) y Supabase como backend. No se
introduce un framework de UI, gestor de estado o motor de persistencia alternativo sin una
enmienda a esta constitución que justifique el cambio.

## Flujo de Trabajo de Desarrollo (Spec-Driven Development)

Toda feature nueva que toque datos del hogar, el vault, permisos, o más de un módulo, MUST
seguir el flujo: `/spec` (discovery del repo con evidencia + entrevista acotada, máximo 2
rondas) → `/spec-review` (agente independiente `spec-reviewer`, verifica cada afirmación
contra el código) → `/speckit-plan` → (`/speckit-checklist` opcional) → `/speckit-tasks` →
(`/speckit-analyze` opcional) → `/speckit-implement` → `/speckit-converge`. No se avanza a
`/speckit-plan` hasta que `/spec-review` devuelva **PASS** o **NEEDS-DECISION** (y en ese
caso, la decisión pendiente se resuelve y se anota antes de seguir); un veredicto
**BLOCKED** MUST corregirse en el spec (con una entrada `vN` nueva en su encabezado) y
re-revisarse. Cada spec, su historial de revisiones (`spec-review.md`) y su plan viven en
`specs/<NNN>-<slug>/` y se versionan en git junto con el código. Las ramas de feature siguen
la convención `<NNN>-feature/<slug>` ya usada en el repo (ver `001-feature/solve-details`).
Antes de mergear a `main`, `yarn lint`, `yarn typecheck` y `yarn format` MUST pasar sin
errores. Bugs y pendientes conocidos se registran en `docs/pending.md` hasta que se conviertan
en un spec propio.

**Cuándo NO hace falta `/spec`**: un fix acotado de un handler, un cambio de estilo, un typo,
o cualquier cambio donde no haya ninguna decisión de datos/contrato/permisos que otra persona
pudiera discutir — ahí un commit bien escrito alcanza, sin pasar por el flujo de specs.

## Governance

Esta constitución prevalece sobre cualquier convención no escrita del proyecto. Las
enmiendas se hacen exclusivamente vía `/speckit-constitution`, documentando el Sync
Impact Report correspondiente. Versionado semántico: MAJOR para eliminación o
redefinición incompatible de un principio, MINOR para principios nuevos o expansión
material de una sección existente, PATCH para aclaraciones o correcciones de redacción.
Todo spec y plan generado MUST incluir una verificación de cumplimiento de esta
constitución en su sección "Constitution Check".

**Version**: 2.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-11-20
