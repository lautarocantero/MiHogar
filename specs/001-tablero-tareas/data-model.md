# Data Model: Tablero de tareas interno

Todo lo de acá vive fuera del vault cifrado (`vaultFileSchema.ts` no cambia). Se persiste en
`tasks.json`, validado con Zod al cargar y al guardar (mismo principio que `vaultFileSchema.parse`
en `vaultThunks.ts:66,73`).

## TasksFile (envelope de `tasks.json`)

```ts
type TasksFile = {
  version: 1
  tasks: TaskDoc[]
  categories: TaskCategory[]
  nextSeq: number // contador del key legible, con piso (mismo mecanismo que README §5.4)
}
```

Default cuando el archivo no existe: `{ version: 1, tasks: [], categories: DEFAULT_TASK_CATEGORIES, nextSeq: 0 }`
(`DEFAULT_TASK_CATEGORIES` = Bug/Feature/QA/Chore, sembradas una sola vez al crear el archivo —
igual que `DEFAULT_PREFERENCES` en `preferencesStore.ts:6-10`, no hace falta el `$setOnInsert`
concurrente del README de origen porque acá no hay dos procesos escribiendo el mismo archivo a la
vez).

## TaskDoc

```ts
type TaskDoc = {
  id: string // uuid v4, igual que el resto de las entidades del repo
  seq: number // key legible = `MIHOGAR-${seq}`
  title: string // 1..200
  description: string // 0..20000, texto plano (sin markdown — Principio IV/consistencia con notas de pagos)
  statusId: TaskStatusId
  severity: TaskSeverity // default 'medium'
  categoryIds: string[] // 0..10, sólo ids del catálogo TaskCategory
  repos: string[] // 0..10, sólo del catálogo TASK_GITHUB_REPOS (ver contracts/github-rest.md)
  links: TaskLink[] // 0..50
  checklist: TaskChecklistItem[] // 0..200, texto 1..500
  notes: TaskNote[] // 0..200, texto 1..4000
  startDate?: string // 'YYYY-MM-DD'
  dueDate?: string // 'YYYY-MM-DD', startDate <= dueDate si ambas presentes
  rank: number // float, orden dentro de la columna (research.md §4)
  archivedAt?: string // ISO datetime; presente = archivada
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  updatedBy: 'user' | 'github' // 'github' cuando lo escribió el último sync
}

type TaskChecklistItem = { id: string; text: string; done: boolean }
type TaskNote = { id: string; text: string; createdAt: string }
```

Derivados que la UI calcula al leer (nunca se guardan — mismo principio del README de origen §3,
"los derivados no se guardan"):

```ts
type TaskGates = { merged: boolean; approved: boolean }
type TaskWithDerived = TaskDoc & { key: string; gates: TaskGates }
```

- `key` = `` `MIHOGAR-${seq}` `` (`src/utils/domain/buildTaskKey.ts`).
- `gates.merged` = todos los links `type: 'pr'` de `repos` del catálogo están `state: 'merged'`, y
  hay al menos uno (README de origen §8.1, sin cambios).
- `gates.approved` = todos esos mismos PRs tienen `approved === true`, y hay al menos uno.

## TaskLink

```ts
type TaskLink = {
  id: string // uuid propio, no repo+number (mismo motivo que README de origen §4.1)
  repo: string // 'owner/name', canónico según base.repo.full_name de GitHub
  type: 'pr' | 'issue' // sale de la respuesta de GitHub, nunca de la URL (README origen §6.3)
  number: number
  url: string
  title?: string
  state?: 'open' | 'closed' | 'merged' | 'draft'
  stateReason?: 'completed' | 'not_planned' | 'reopened' // sólo issues
  approved?: boolean // undefined = no se pudo leer; false = leído, sin aprobación
  mergedAt?: string
  mergeCommitSha?: string
  etag?: string
  syncedAt?: string
  syncError?: string
}
```

## TaskCategory

```ts
type TaskCategory = { id: string; label: string; color: string } // label <= 60, color hex
```

## Enums (`src/typings/domain/enums.ts`)

```ts
enum TaskStatusId {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  BLOCKED = 'blocked',
  DONE = 'done'
}

enum TaskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

`TASK_STATUSES` (`src/utils/domain/taskStatuses.ts`) es un `const` con `{ id, label, role }`,
igual patrón que el README de origen §5.1 (`role: 'intake' | 'wip' | 'review' | 'done'`, columna
`BACKLOG` con `role: 'intake'`, `IN_PROGRESS` con `role: 'wip'`, `IN_REVIEW` con `role: 'review'`,
`DONE` con `role: 'done'`, `TODO`/`BLOCKED` sin rol). La automatización de `decideTaskTransition`
depende sólo de `role`, nunca del `id` — igual que el README de origen.

## Transiciones automáticas (`decideTaskTransition`, función pura)

Entrada: `statusId` actual, `links` antes del sync, `links` después del sync. Reglas (idénticas a
README de origen §7, adaptadas sin entornos):

1. Si aparece un PR de `repos` del catálogo en estado `open` (no draft) y la tarea está en una
   columna `role: 'wip'` → mover a la columna `role: 'review'`.
2. Si había al menos un PR abierto, ya no queda ninguno abierto, y **todos** los PRs que cuentan
   están `merged` (con al menos uno) → mover a la columna `role: 'done'` (si no estaba ahí ya).
3. Ningún otro caso dispara movimiento. Una tarea movida a mano fuera de estas reglas no se
   revierte en el siguiente sync (se compara transición, no estado final — README origen §7).

## Slices Redux

- `src/store/tasks/tasksSlice.ts`: `createEntityAdapter<TaskDoc>()`, acciones
  `hydrateTasks`/`addTask`/`updateTask`/`removeTask`/`applyGithubSync` (bulk upsert desde el sync;
  no empieza con `hydrate` para que sí dispare autoguardado, a diferencia de la hidratación
  inicial).
- `src/store/taskCategories/taskCategoriesSlice.ts`: mismo patrón que
  `src/store/categories/categoriesSlice.ts` (`hydrateTaskCategories`/`addTaskCategory`/
  `updateTaskCategory`/`removeTaskCategory`, con `$pull` manual del id borrado sobre
  `tasks[].categoryIds` al borrar una categoría, ejecutado en el thunk, no en el reducer).
- Estado de `nextSeq` vive fuera de Redux (no hace falta reactividad de UI sobre el contador): lo
  mantiene `tasksThunks.ts` junto al resto del `TasksFile` y se persiste con el resto.

## Validación (Zod, `src/validation/`)

- `taskSchema.ts`, `taskLinkSchema.ts`, `taskCategorySchema.ts`, `tasksFileSchema.ts`: reflejan los
  tipos de arriba, mismos límites (200/20000/500/200/4000/200/50/10/10/60 — ver README de origen
  §4.6, que el spec toma como referencia razonable, spec:203-205).
- `addTaskFormSchema.ts`: subconjunto editable por el usuario en el formulario (título obligatorio,
  el resto opcional) — mismo patrón que `addDebtFormSchema.ts`.
- `addTaskCategoryFormSchema.ts`: `{ label, color }`.

## Contratos afectados

Ver `contracts/ipc-tasks.md` (persistencia) y `contracts/github-rest.md` (sync).
