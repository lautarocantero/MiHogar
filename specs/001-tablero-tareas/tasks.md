---
description: 'Task list for 001-tablero-tareas'
---

# Tasks: Tablero de tareas interno

**Input**: Design documents from `/specs/001-tablero-tareas/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ipc-tasks.md,
contracts/github-rest.md, quickstart.md

**Tests**: no se generan tareas de test — el repo no tiene test runner instalado
(`research.md` §5) y el spec no pidió TDD. La verificación es `yarn typecheck` + `yarn lint` +
`quickstart.md`.

**Organización**: por user story, derivadas de spec.md §3 ("Cómo debería funcionar") y §2
(Alcance). Cada una es un incremento usable de punta a punta.

- **US1 (P1)** — Tablero kanban con CRUD manual de tareas (persistencia propia, sin GitHub).
- **US2 (P2)** — Catálogo de categorías de tareas.
- **US3 (P3)** — Vincular un PR/issue a mano por URL y ver los checks derivados.
- **US4 (P4)** — Sincronizar con GitHub (token, descubrimiento por key, refresco, transiciones
  automáticas).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: a qué user story pertenece (US1/US2/US3/US4)

---

## Phase 1: Setup

**Propósito**: no hay inicialización de proyecto nueva (el repo, `yarn`, TypeScript, ESLint ya
están configurados). Esta fase sólo confirma que el punto de partida es el correcto.

- [x] T001 Confirmar que la rama activa es `001-feature/tablero-tareas` (crearla desde `main` si
      no existe, según la convención de `.specify/memory/constitution.md`: "Flujo de Trabajo de
      Desarrollo").

---

## Phase 2: Foundational (Blocking Prerequisites)

**Propósito**: todo lo que las cuatro user stories necesitan para existir — tipos, storage,
canales IPC, wiring de Redux y de rutas. Ninguna user story se puede implementar hasta que esta
fase esté completa.

**⚠️ CRÍTICO**: no arrancar la Phase 3 sin terminar ésta.

### Tipos y validación de dominio

- [x] T002 [P] Agregar `TaskStatusId` (`backlog`|`todo`|`in_progress`|`in_review`|`blocked`|`done`)
      y `TaskSeverity` (`low`|`medium`|`high`|`critical`) a `src/typings/domain/enums.ts`
      (`data-model.md` sección Enums).
- [x] T003 [P] Crear `src/utils/domain/taskStatuses.ts` con la constante `TASK_STATUSES` (`{ id,
label, role }[]`, `role: 'intake'|'wip'|'review'|'done'` sólo en `backlog`→intake,
      `in_progress`→wip, `in_review`→review, `done`→done; `todo`/`blocked` sin `role`) y las
      constantes `TASK_KEY_PREFIX = 'MIHOGAR'` y `TASK_GITHUB_REPOS = ['lautarocantero/MiHogar'] as const`
      (`contracts/github-rest.md` sección "Configuración fija").
- [x] T004 [P] Crear `src/validation/taskCategorySchema.ts`: `{ id: string().min(1), label:
string().min(1).max(60), color: string().min(1) }` (`data-model.md` sección TaskCategory, límite
      60 de `label`).
- [x] T005 [P] Crear `src/validation/taskLinkSchema.ts` reflejando `TaskLink` de `data-model.md`
      (`id`, `repo`, `type: enum('pr','issue')`, `number: number().int()`, `url`, y los campos
      opcionales `title/state/stateReason/approved/mergedAt/mergeCommitSha/etag/syncedAt/syncError`).
- [x] T006 Crear `src/validation/taskSchema.ts` reflejando `TaskDoc` de `data-model.md`: `title`
      1..200, `description` 0..20000, `categoryIds` array 0..10, `repos` array 0..10, `links` array
      0..50 de `taskLinkSchema`, `checklist` array 0..200 de `{ id, text: string().min(1).max(500),
done: boolean() }`, `notes` array 0..200 de `{ id, text: string().min(1).max(4000), createdAt }`,
      `startDate`/`dueDate` como `'YYYY-MM-DD'` con refine `startDate <= dueDate` cuando ambas están
      presentes (depende de T002, T004, T005).
- [x] T007 Crear `src/validation/tasksFileSchema.ts`: `{ version: literal(1), tasks:
array(taskSchema).default([]), categories: array(taskCategorySchema).default([]), nextSeq:
number().int().nonnegative().default(0) }` (depende de T004, T006).
- [x] T008 Agregar a `src/typings/domain/types.ts` los tipos derivados con `z.infer`: `Task`,
      `TaskLink`, `TaskCategory`, `TasksFile` (mismo patrón que las líneas existentes 18-31 del
      archivo) (depende de T007).

### Persistencia (Electron main/preload)

- [x] T009 [P] Agregar `getTasksFilePath(): string` a `electron/main/persistence/vaultPaths.ts`
      (`join(app.getPath('userData'), 'tasks.json')`, mismo patrón que `getPreferencesFilePath` en
      ese archivo, líneas 16-18).
- [x] T010 Crear `electron/main/persistence/tasksStore.ts` con `DEFAULT_TASK_CATEGORIES` (Bug,
      Feature, QA, Chore) y `readTasksFile`/`writeTasksFile`, mismo cuerpo que
      `electron/main/persistence/preferencesStore.ts` (líneas 12-23) pero apuntando a
      `getTasksFilePath()` y con default `{ version: 1, tasks: [], categories:
DEFAULT_TASK_CATEGORIES, nextSeq: 0 }` (`contracts/ipc-tasks.md`) (depende de T009).
- [x] T011 Agregar `TASKS_LOAD: 'tasks:load'` y `TASKS_SAVE: 'tasks:save'` a
      `shared/ipcChannels.ts` (junto a `PREFS_GET`/`PREFS_SET`, líneas 14-15).
- [x] T012 Agregar el tipo `TasksFile` a `shared/vaultEnvelope.types.ts` (o reexportar el de
      `src/typings/domain/types.ts` si el proyecto ya comparte tipos entre `shared/` y `src/` —
      confirmar el patrón de import cruzado al implementar) y extender `PreferencesFile` (líneas
      11-15) con `githubTasksToken?: string`.
- [x] T013 Crear `electron/main/ipc/tasksHandlers.ts` con `registerTasksHandlers()`: handler para
      `TASKS_LOAD` → `readTasksFile()`, handler para `TASKS_SAVE` → `writeTasksFile(tasksFile)`, mismo
      patrón que `electron/main/ipc/preferencesHandlers.ts` (depende de T010, T011).
- [x] T014 Registrar `registerTasksHandlers()` en `electron/main/index.ts` junto a
      `registerPreferencesHandlers()` (línea 40) (depende de T013).
- [x] T015 Agregar `tasksStorageApi` (`load`/`save`) a `electron/preload/index.ts`, expuesto vía
      `contextBridge.exposeInMainWorld('tasksStorageApi', tasksStorageApi)`, mismo patrón que
      `preferencesApi` (líneas 36-40, 49) y exportar el tipo `TasksStorageApi` (depende de T011, T012).
- [x] T016 Declarar `window.tasksStorageApi: TasksStorageApi` en el archivo de tipos globales del
      preload (localizar dónde están declarados hoy `window.vaultApi`/`window.preferencesApi` —
      `contracts/ipc-tasks.md` lo deja como NO MEDIDO a confirmar en este paso) (depende de T015).
- [x] T017 [P] Crear `src/apis/tasksStorageApi.ts` con `loadTasksFile()`/`saveTasksFile(tasksFile)`
      llamando a `window.tasksStorageApi` (depende de T016).

### Redux (slices, thunks, middleware, wiring)

- [x] T018 [P] Crear `src/store/tasks/typings/{types.ts,enums.ts}` si hace falta tipado propio del
      slice (más allá de los tipos de dominio ya creados en T008) — evaluar si es necesario antes de
      crear archivos vacíos (depende de T008).
- [x] T019 Crear `src/store/tasks/tasksSlice.ts` con `createEntityAdapter<Task>()` y las acciones
      `hydrateTasks` (`adapter.setAll`), `addTask`, `updateTask` (`upsertOne`), `removeTask`, y
      `applyGithubSync` (bulk `upsertMany` — nombre sin prefijo `hydrate` a propósito, para que sí
      dispare autoguardado; `data-model.md` sección Slices Redux) (depende de T008).
- [x] T020 [P] Crear `src/store/tasks/tasksSelectors.ts` con `selectAllTasks`, `selectTaskById`,
      mismo patrón que `src/store/categories/categoriesSelectors.ts` (depende de T019).
- [x] T021 Crear `src/store/taskCategories/taskCategoriesSlice.ts` con `createEntityAdapter
<TaskCategory>()` y acciones `hydrateTaskCategories`, `addTaskCategory`, `updateTaskCategory`,
      `removeTaskCategory` (depende de T008).
- [x] T022 [P] Crear `src/store/taskCategories/taskCategoriesSelectors.ts` (depende de T021).
- [x] T023 Crear `src/store/tasks/tasksThunks.ts` con `loadTasksThunk` (llama a `loadTasksFile()`,
      hidrata `tasks`+`taskCategories`, guarda `nextSeq` en una variable de módulo o en el propio
      thunk state) y `saveTasksThunk` (arma el `TasksFile` completo desde `tasksSelectors`+
      `taskCategoriesSelectors`+`nextSeq`, valida con `tasksFileSchema.parse`, llama a
      `saveTasksFile()`) — mismo espíritu que `buildVaultFileFromState.ts`+`saveVaultThunk` pero para
      este archivo aparte (depende de T017, T019, T021).
- [x] T024 Crear `src/store/middleware/tasksPersistenceMiddleware.ts`: dispara `saveTasksThunk`
      ante cualquier acción con prefijo `tasks/` o `taskCategories/` que no matchee `/^hydrate/` en el
      nombre de la acción (mismo filtro que `persistenceMiddleware.ts` líneas 17-30, pero sin chequear
      `state.vault.status` — este storage es independiente del vault) (depende de T023).
- [x] T025 Agregar `tasks: tasksReducer, taskCategories: taskCategoriesReducer` a
      `src/store/rootReducer.ts` (depende de T019, T021).
- [x] T026 Concatenar `tasksPersistenceMiddleware` en `src/store/index.ts` junto a
      `persistenceMiddleware` (depende de T024).

### Ruta y navegación

- [x] T027 [P] Agregar `TASKS: '/tareas'` a `src/router/routes.ts` (junto a `SETTINGS: '/ajustes'`,
      líneas 1-12).
- [x] T028 Agregar la ruta lazy `<Route path={ROUTES.TASKS} element={<TasksPage />} />` dentro del
      `<Route element={<AppLayout />}>` de `src/router/AppRouter.tsx`, mismo patrón que
      `DebtsPage`/`SettingsPage` (depende de T027, y de que exista `TasksPage` — se crea en US1, T032;
      esta tarea puede dejar el import comentado o crear un placeholder mínimo hasta T032 si se
      prefiere ejecución estrictamente secuencial).
- [x] T029 Leer `src/layout/Sidebar/useSidebarItems.ts` y agregar la entrada "Tareas" apuntando a
      `ROUTES.TASKS` con un ícono de `@mui/icons-material` acorde (ej. `ViewKanban` o similar —
      confirmar qué íconos usa el resto de entradas al abrir el archivo) (depende de T027).

**Checkpoint**: con T002-T029 completas, existe storage propio funcionando end-to-end (IPC +
Redux + persistencia) y una ruta `/tareas` navegable, aunque `TasksPage` todavía no tenga UI real.
Recién acá pueden arrancar las user stories.

---

## Phase 3: User Story 1 - Tablero kanban con CRUD manual (Priority: P1) 🎯 MVP

**Goal**: crear, ver, mover, editar y archivar tareas en un kanban persistente, sin ninguna
dependencia de GitHub.

**Independent Test**: `quickstart.md` sección 3 completa (crear tarea rápida en Backlog, crear
tarea completa, drag & drop entre columnas, checklist/notas, archivar/restaurar, y que sobreviva a
un reinicio de la app).

### Implementación

- [x] T030 [P] [US1] Crear `src/utils/domain/buildTaskKey.ts` (`` `${TASK_KEY_PREFIX}-${seq}` ``)
      y `src/utils/domain/suggestBranchName.ts` (`` `mihogar-${seq}-${slug de las 3 primeras palabras
del título, sin acentos}` ``) (depende de T003).
- [x] T031 [P] [US1] Crear `src/utils/domain/rankBetween.ts`: `rankBetween(before?: number,
after?: number): number` (`(a+b)/2` entre dos, `b - 1000` al principio, `a + 1000` al final, `0`
      en columna vacía) y una función de rebalanceo que renumera de a 1000 cuando el hueco entre dos
      ranks baja de `1e-9` (`research.md` §4, `data-model.md`).
- [x] T032 [US1] Crear `src/modules/tasks/typings/{types.ts,props.ts}` con los tipos de vista
      (`TaskView` = `Task` + `key` + `gates`, props de los componentes de este módulo) (depende de
      T008).
- [x] T033 [US1] Crear `src/utils/domain/deriveTaskGates.ts`: `deriveTaskGates(task: Task):
TaskGates` — `merged` = todos los links `type: 'pr'` de repos del catálogo con `state:
'merged'`, y al menos uno; `approved` = todos esos mismos PRs con `approved === true`, y al
      menos uno (`data-model.md` sección TaskDoc, derivados) (depende de T003, T008).
- [x] T034 [US1] Crear `src/store/tasks/useTasksData.ts` (o dentro de `modules/tasks/`): hook que
      llama `loadTasksThunk` en un `useEffect` de montaje **una sola vez** y expone `tasks`
      (`TaskView[]`, con `key`+`gates` calculados vía T030+T033), `categories`, `isLoading` — sin
      disparar ningún sync de GitHub acá (spec §5 supuesto 6) (depende de T023, T030, T033).
- [x] T035 [US1] Crear `src/validation/addTaskFormSchema.ts`: `title` obligatorio 1..200,
      `description`/`severity`/`categoryIds`/`repos`/`startDate`/`dueDate` opcionales, mismo patrón
      que `src/validation/addDebtFormSchema.ts` (depende de T006).
- [x] T036 [US1] Crear `src/modules/tasks/useCreateTask.ts`: arma un `Task` nuevo (`id: uuidv4()`,
      `seq` = `nextSeq` actual + 1, `statusId` = el `id` de la columna con `role: 'intake'`,
      `rank` = `rankBetween(undefined, primerRankDeLaColumna)`, `createdAt`/`updatedAt` = ahora,
      `updatedBy: 'user'`) y despacha `addTask`, mismo patrón que `useCreateDebt.ts` (`useLoader`,
      `showToast`) (depende de T019, T031, T034, T035).
- [x] T037 [US1] Crear `src/modules/tasks/useUpdateTask.ts` (edición de campos desde el detalle:
      título, descripción, severidad, categorías, repos, fechas) y `src/modules/tasks/
useArchiveTask.ts` (`archivedAt` = ahora / `undefined` para restaurar), ambos despachando
      `updateTask` (depende de T019, T034).
- [x] T038 [US1] Crear `src/modules/tasks/useMoveTask.ts`: recibe `taskId`, `statusId` destino,
      `beforeId?`/`afterId?`, calcula el nuevo `rank` con `rankBetween` y despacha `updateTask` con
      `statusId`+`rank` nuevos (depende de T019, T031, T034).
- [x] T039 [US1] Crear `src/modules/tasks/components/TaskCard.tsx`: tarjeta con key, severidad (1
      a 4 barras encendidas, crítica en un color distintivo), título, contador de checklist
      (`done/total`), contador de notas — sin nada de GitHub todavía (eso lo agrega US3) (depende de
      T032, T033).
- [x] T040 [US1] Crear `src/modules/tasks/components/TaskColumn.tsx`: columna con drop target
      (drag & drop nativo HTML5, sin librería — Principio V/restricción del README de origen), lista
      de `TaskCard`, e input de alta rápida sólo en la columna con `role: 'intake'` (depende de T039).
- [x] T041 [US1] Crear `src/modules/tasks/components/TaskBoard.tsx`: una `TaskColumn` por entrada
      de `TASK_STATUSES`, maneja el drop (llama `useMoveTask`), soporta mover con teclado (Alt+←/→
      sobre la tarjeta con foco) (depende de T003, T038, T040).
- [x] T042 [US1] Crear `src/modules/tasks/components/TaskFormFields.tsx` reutilizando
      `FormSectionHeader`/`LeafButton` de `src/components/shared/` (Principio IV de la constitución) y
      `src/modules/tasks/components/AddTaskDialog.tsx` (modal de alta completa: título obligatorio,
      resto opcional) (depende de T035, T036).
- [x] T043 [US1] Crear `src/modules/tasks/components/TaskDetailDialog.tsx`: descripción, checklist
      editable (agregar/tildar/borrar ítem, límite 500 caracteres por ítem), notas (agregar, límite
      4000 caracteres), fechas, botón archivar/restaurar, nombre de rama sugerido con botón copiar
      (depende de T030, T037, T042).
- [x] T044 [US1] Crear `src/modules/tasks/components/ArchivedTasksList.tsx`: lista simple de
      tareas archivadas con botón restaurar (depende de T037).
- [x] T045 [US1] Crear `src/modules/tasks/TasksPage.tsx`: monta `useTasksData`, header (título,
      toggle archivadas, botón "Sincronizar GitHub" — deshabilitado o con placeholder hasta US4),
      `TaskBoard`, `AddTaskDialog`, `TaskDetailDialog`, `ArchivedTasksList` (depende de T034, T041,
      T042, T043, T044).
- [x] T046 [US1] Completar la ruta `/tareas` en `src/router/AppRouter.tsx` con el `TasksPage` real
      (si T028 quedó con placeholder) (depende de T045).

**Checkpoint**: en este punto, `yarn dev` → `/tareas` permite crear, mover, editar, archivar y
restaurar tareas, con persistencia real en `tasks.json` (validable con `quickstart.md` §3),
totalmente independiente de GitHub.

---

## Phase 4: User Story 2 - Categorías de tareas (Priority: P2)

**Goal**: catálogo propio de categorías de tareas (Bug/Feature/QA/Chore por default, editable),
asignable a cada tarea, independiente de las categorías financieras existentes.

**Independent Test**: crear una categoría nueva, asignarla a una tarea desde `AddTaskDialog`/
`TaskDetailDialog`, borrar una categoría y verificar que desaparece de todas las tareas que la
tenían asignada (`$pull`, `data-model.md` sección Slices Redux).

### Implementación

- [x] T047 [P] [US2] Crear `src/validation/addTaskCategoryFormSchema.ts`: `{ label:
string().min(1).max(60), color: string().min(1) }` (depende de T004).
- [x] T048 [US2] Crear `src/modules/tasks/useTaskCategories.ts`: `list` (selector), `create`
      (despacha `addTaskCategory`), `update`, y `remove` — al remover, además de despachar
      `removeTaskCategory`, recorre `tasksSelectors.selectAll` y despacha `updateTask` para cada tarea
      que tenga ese id en `categoryIds`, quitándolo (equivalente al `$pull` del README de origen,
      hecho en el thunk porque acá no hay una sola operación atómica de Mongo) (depende de T021, T022,
      T037, T047).
- [x] T049 [US2] Crear `src/modules/tasks/components/TaskCategoryChips.tsx` (mostrar categorías
      asignadas como chips de color en `TaskCard` y en el detalle) y
      `src/modules/tasks/components/TaskCategoryPicker.tsx` (selector múltiple, máximo 10 por tarea —
      `data-model.md`, campo `categoryIds`) (depende de T048).
- [x] T050 [US2] Integrar `TaskCategoryPicker` en `TaskFormFields.tsx`/`AddTaskDialog.tsx` y en
      `TaskDetailDialog.tsx`, y `TaskCategoryChips` en `TaskCard.tsx` (depende de T039, T042, T043,
      T049).
- [x] T051 [US2] Crear una sección simple de administración de categorías (crear/editar/borrar)
      dentro de `TasksPage.tsx` o como diálogo aparte accesible desde el header (depende de T048,
      T049).

**Checkpoint**: US1 + US2 funcionando juntas — tablero completo con categorías propias, sin tocar
nada de GitHub.

---

## Phase 5: User Story 3 - Vincular GitHub a mano (Priority: P3)

**Goal**: pegar la URL de un PR o issue de GitHub en una tarea y verla vinculada, con los checks
Mergeado/Aprobado mostrados (aunque todavía vacíos/`undefined` hasta el primer sync de US4).

**Independent Test**: pegar `https://github.com/lautarocantero/MiHogar/pull/N` (o `/issues/N`) en
el detalle de una tarea → aparece como link con su número y tipo, sin necesitar token de GitHub
cargado (esto es guardar el link, no traer datos en vivo — eso es US4).

### Implementación

- [x] T052 [P] [US3] Crear `src/utils/domain/parseGithubUrl.ts`: acepta
      `https://github.com/{owner}/{repo}/pull/{n}` o `/issues/{n}`, con o sin query/fragmento/barra
      final; cualquier otra cosa devuelve `null` (para 400 en el formulario) — `type` sale de si dice
      `pull` o `issues` en la URL en este paso manual (README de origen §6.1-A; en el sync automático
      de US4 el `type` en cambio sale de la respuesta de GitHub, no de la URL, ver
      `contracts/github-rest.md`) (depende de T003).
- [x] T053 [US3] Crear `src/modules/tasks/useAddTaskLink.ts`: valida con `parseGithubUrl` +
      `taskLinkSchema`, chequea que no exista ya un link con el mismo `repo`+`number` en la tarea (400
      si sí — `data-model.md` límite de 50 links), arma un `TaskLink` nuevo (`id: uuidv4()`, resto de
      campos `undefined` hasta el primer sync) y despacha `updateTask` (depende de T006, T037, T052).
- [x] T054 [US3] Crear `src/modules/tasks/useRemoveTaskLink.ts` (despacha `updateTask` sin ese
      link) (depende de T037).
- [x] T055 [US3] Crear `src/modules/tasks/components/TaskLinksSection.tsx`: input para pegar URL
      (vincula sola al pegar, sin apretar Enter — README de origen §6.1-A), lista de links con ícono/
      color según estado (`open`/`closed`/`merged`/`draft`, un PR cerrado sin mergear en un color de
      alerta distinto al de un issue cerrado — README de origen §10.2, punto "Un issue cerrado no es
      rojo"), botón quitar (depende de T053, T054).
- [x] T056 [US3] Integrar `TaskLinksSection` en `TaskDetailDialog.tsx`, y mostrar los dos checks
      derivados (`deriveTaskGates`, T033) en `TaskCard.tsx` y en el detalle como indicadores no
      tildables (`data-model.md`: "los derivados no se guardan, nunca son tildables a mano") (depende
      de T033, T043, T055).

**Checkpoint**: US1 + US2 + US3 — se pueden vincular PRs/issues a mano y ver el estado que tenían
guardado la última vez, sin depender de que exista ya el token ni de que corra el sync.

---

## Phase 6: User Story 4 - Sincronizar con GitHub (Priority: P4)

**Goal**: botón "Sincronizar GitHub" que descubre PRs por key, refresca los links existentes, y
mueve las tarjetas solas según las transiciones automáticas.

**Independent Test**: `quickstart.md` secciones 4 y 5 completas (token en Ajustes, sync sin
links, sync con un PR real, transición a "En revisión" y a "Hecho", que una tarea reabierta a mano
no vuelva a cerrarse sola, y que sin token el error sea legible).

### Implementación

- [x] T057 [P] [US4] Crear `src/modules/settings/useGithubTokenPreference.ts`: lee/escribe
      `preferences.githubTasksToken` vía `getPreferences()`/`setPreferences()` de
      `src/apis/preferencesApi.ts` (depende de T012).
- [x] T058 [US4] Crear `src/modules/settings/components/GithubTokenField.tsx` (campo de texto tipo
      password con mostrar/ocultar, igual criterio que `PasswordField.tsx` de
      `src/components/shared/`) e integrarlo en `src/modules/settings/SettingsPage.tsx` (depende de
      T057).
- [x] T059 [US4] Crear `src/apis/githubTasksApi.ts`: `listPulls(repo)`, `getPull(repo, number,
etag?)`, `listReviews(repo, number)`, `getIssue(repo, number)` — `fetch` directo a
      `api.github.com` con `Authorization: Bearer <token>` y `Accept: application/vnd.github+json`
      (`contracts/github-rest.md` Paso 1-2) (depende de T003).
- [x] T060 [US4] Crear `src/utils/domain/decideTaskTransition.ts`: función **pura**
      `decideTaskTransition(currentStatusId, linksBefore, linksAfter): TaskStatusId | null` con las
      dos reglas de `data-model.md` sección "Transiciones automáticas" (PR abierto no-draft + columna
      `role: 'wip'` → primera columna `role: 'review'`; todos los PRs que cuentan mergeados, había al
      menos uno abierto y ya no queda ninguno → primera columna `role: 'done'`; cualquier otro caso →
      `null`, no mover) (depende de T003).
- [x] T061 [US4] Crear `src/utils/domain/deriveApproved.ts`: dado un array de reviews (`{ user,
state, submitted_at }`), toma la última review de cada reviewer, descarta
      `COMMENTED`/`DISMISSED`/`PENDING`, devuelve `true` sólo si hay al menos un veredicto y todos son
      `APPROVED` (`contracts/github-rest.md` Paso 2) (depende de T003).
- [x] T062 [US4] Crear `src/store/tasks/tasksThunks.ts::syncGithubThunk`: si no hay
      `githubTasksToken` en preferencias, corta y despacha un error legible (`showToast`/
      `setErrorMessage`) sin pegarle a la red; si hay token, por cada repo de `TASK_GITHUB_REPOS`
      corre el Paso 1 (`listPulls` + regex `\bMIHOGAR-(\d+)\b` en `title`/`head.ref`, nunca en el
      body) para descubrir links nuevos, después por cada tarea sin archivar con al menos un link
      corre el Paso 2 (`getPull` con `If-None-Match`, `listReviews` + `deriveApproved`, resolver
      issue-que-es-PR por el campo `pull_request` de la respuesta — nunca por la URL), compara con
      `decideTaskTransition` y despacha `applyGithubSync` con las tareas actualizadas (uno o varios
      `upsertMany`), y devuelve `{ discovered, refreshed, unchanged, moved, errors[] }` (depende de
      T059, T060, T061).
- [x] T063 [US4] Crear `src/modules/tasks/useSyncGithub.ts`: dispara `syncGithubThunk` **sólo** al
      apretar el botón (nunca en un `useEffect` de montaje — spec §5 supuesto 6, no negociable),
      muestra un toast con el reporte (`showToast`, patrón ya usado en `useCreateDebt.ts`) (depende de
      T062).
- [x] T064 [US4] Conectar el botón "Sincronizar GitHub" de `TasksPage.tsx` (dejado deshabilitado/
      placeholder en T045) a `useSyncGithub`, con estado de carga mientras corre (depende de T045,
      T063).
- [x] T065 [US4] Actualizar `TaskLinksSection.tsx`/`TaskCard.tsx` para reflejar `syncError` por
      link ("no se pudo leer GitHub", nunca mostrado como si el dato fuera fresco) y `syncedAt`
      (depende de T055, T062).

**Checkpoint**: las cuatro user stories completas — tablero, categorías, vínculo manual y sync
automático — cubren el spec entero (§2 Dentro). `quickstart.md` completo debería pasar de punta a
punta.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Propósito**: mejoras transversales, después de que las user stories que se quieran entregar
estén completas.

- [x] T066 [P] Correr `yarn typecheck` y `yarn lint`, corregir lo que salga.
- [x] T067 [P] Correr `yarn format` (mencionado como gate en `.specify/memory/constitution.md`,
      sección Flujo de Trabajo).
- [x] T068 Ejecutar `quickstart.md` completo (secciones 1 a 6) y anotar cualquier desvío.
- [x] T069 Revisar que `vaultFileSchema.ts` y `buildVaultFileFromState.ts` no se hayan tocado
      (spec §7, último acceptance criterion — el vault financiero no debe cambiar de schema).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Phase 1 — bloquea las cuatro user stories.
- **US1 (Phase 3)**: depende de Phase 2. Es la única imprescindible para un MVP usable.
- **US2 (Phase 4)**: depende de Phase 2. Usa componentes de US1 (`TaskCard`, `TaskFormFields`,
  `TaskDetailDialog`) para integrarse, pero el catálogo de categorías en sí (`taskCategoriesSlice`,
  `useTaskCategories`) es independiente.
- **US3 (Phase 5)**: depende de Phase 2. Usa `TaskDetailDialog`/`TaskCard` de US1 para integrarse,
  pero `parseGithubUrl`/`useAddTaskLink`/`TaskLinksSection` son independientes de US2.
- **US4 (Phase 6)**: depende de Phase 2 y de US3 (necesita que existan links guardados —
  `TaskLink`, `TaskLinksSection` — para tener algo que refrescar; y usa el botón de header creado
  en US1 T045).
- **Polish (Phase 7)**: depende de las user stories que se decida entregar.

### User Story Dependencies

- US1 → ninguna (además de Foundational).
- US2 → integra visualmente con US1 pero su lógica de datos es independiente.
- US3 → integra visualmente con US1; independiente de US2.
- US4 → depende de US3 (necesita el modelo de links poblable a mano para tener sentido sincronizar
  algo).

### Parallel Opportunities

- Dentro de Foundational: T002, T003, T004, T005 en paralelo; T009, T017, T018, T020, T022, T027
  en paralelo cuando sus dependencias estén listas.
- Dentro de US1: T030, T031 en paralelo.
- Dentro de US2: T047 en paralelo con el resto de Foundational tardío.
- Dentro de US3: T052 en paralelo.
- Dentro de US4: T057 en paralelo con T059/T060/T061.
- Polish: T066, T067 en paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Phase 1 + Phase 2 completas (storage, IPC, Redux, ruta).
2. Phase 3 (US1) completa.
3. **Parar y validar** con `quickstart.md` §3.
4. Ya es usable como tablero personal, sin GitHub ni categorías propias (se puede vivir sin ellas
   un tiempo si hace falta priorizar).

### Entrega incremental

1. Setup + Foundational → base lista.
2. US1 → tablero kanban usable (MVP).
3. US2 → categorías propias.
4. US3 → vínculos de GitHub a mano, aunque el sync automático todavía no exista.
5. US4 → sync automático completo — acá el spec queda enteramente cubierto.
6. Polish.
