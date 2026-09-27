# Implementation Plan: Tablero de tareas interno

**Branch**: `001-feature/tablero-tareas` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-tablero-tareas/spec.md`

## Summary

Kanban interno de un solo usuario para bugs/features del propio proyecto miHogar, con
sincronización manual de GitHub (link de PR/issue por URL o por key `MIHOGAR-N`, checks derivados
Mergeado/Aprobado). Persiste en un archivo propio `tasks.json` (sin cifrar, misma carpeta que
`vault.dat`), separado del vault financiero cifrado, con su propio par de canales IPC. El token de
GitHub (fine-grained, solo lectura) vive en `preferences.json`. El sync corre en el renderer con
`fetch` directo a `api.github.com`, disparado sólo por botón (nunca en un efecto de montaje).

## Technical Context

**Language/Version**: TypeScript 5 (strict), igual que el resto del repo (`tsconfig.web.json`,
`tsconfig.node.json`).

**Primary Dependencies**: React 18 + Redux Toolkit (`createEntityAdapter`) + React Router
(`HashRouter`) en renderer; Electron (`ipcMain`/`ipcRenderer`, `fs/promises`) en main; Zod para
validación de formularios (`react-hook-form` + `@hookform/resolvers/zod`); `uuid` para ids;
`date-fns` para fechas. Nada nuevo se agrega a `package.json` — todo esto ya está instalado.

**Storage**: archivo JSON propio `tasks.json` en `app.getPath('userData')` (misma carpeta que
`vault.dat`/`preferences.json`), sin cifrar. Campo nuevo `githubTasksToken?: string` en
`preferences.json` existente. El vault cifrado (`vault.dat`) no se toca.

**Testing**: no hay runner de tests configurado en el repo (`package.json` no tiene script
`test`, no hay `vitest`/`jest` instalado — confirmado en discovery de `/spec`). La verificación es
manual vía `yarn dev` + los pasos de `quickstart.md`, más `yarn typecheck` y `yarn lint`.

**Target Platform**: Electron de escritorio (Linux/Windows/mac), mismo target que el resto de la
app.

**Project Type**: desktop-app (Electron main/preload/renderer), feature nueva dentro del mismo
proyecto — no es una app ni un paquete separado.

**Performance Goals**: N/A (escala de uso personal, cientos de tareas como mucho — mismo criterio
de escala que usa el README de origen, §1).

**Constraints**: el sync a GitHub sólo se dispara por acción explícita del usuario (botón), nunca
dentro de un efecto de carga (spec:128-131, supuesto 6). Descubrimiento limitado a los últimos 30
PRs actualizados por repo (límite de la API de GitHub, no configurable en v1).

**Scale/Scope**: un solo repo en el catálogo (`lautarocantero/MiHogar`), un solo usuario, sin
límite de tareas impuesto por la UI más allá de validación de campos individual.

## Constitution Check

_GATE: debe pasar antes de Phase 0 y se re-chequea después de Phase 1._

| Principio                            | Chequeo                                                                                                                                                                                                                                                                                                                                                                                                                                    | Resultado |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| I. Local-First (NON-NEGOTIABLE)      | El vault financiero cifrado no se toca (no se agrega a `vaultFileSchema.ts` ni a `buildVaultFileFromState.ts`). Los datos que sí salen del dispositivo son PRs/issues públicos de GitHub del propio repo del usuario, vía `fetch` disparado sólo por botón — no son "datos del hogar" (finanzas), y el spec lo declara explícito (spec §2, §5 supuesto 6).                                                                                 | PASS      |
| II. Tipos y validación en los bordes | Todo alta/edición de tarea pasa por Zod (`taskSchema` de dominio + un `*FormSchema` por formulario, igual que `addDebtFormSchema`) + `react-hook-form`, antes de cualquier `dispatch`. Los datos que vienen de GitHub (`links[]`) no los carga el usuario a mano — se validan igual con Zod al recibirlos, pero no pasan por un formulario.                                                                                                | PASS      |
| III. Arquitectura por módulo         | Módulo nuevo `src/modules/tasks/`, slices nuevos `src/store/tasks/` y `src/store/taskCategories/` con `createEntityAdapter` (mismo patrón que `src/store/debts/`, `src/store/categories/`). Ningún otro módulo lee ni muta este estado directamente.                                                                                                                                                                                       | PASS      |
| IV. UI compartida                    | Formularios de alta/edición de tarea reutilizan `FormSectionHeader` y `LeafButton` (`src/components/shared/`) como el resto de los módulos (ver unificación reciente, commit `3e01781`). El tablero (`TaskBoard`, `TaskColumn`, `TaskCard`) es un componente nuevo porque no existe un kanban previo en el repo — no hay nada que reutilizar ahí.                                                                                          | PASS      |
| V. YAGNI                             | No se agrega backend, cola, ORM ni framework nuevo. `tasks.json` reusa exactamente el patrón ya existente de `preferences.json` (`electron/main/persistence/preferencesStore.ts`) con un archivo más, en vez de inventar un motor de persistencia. Todo lo que el README original traía y no resuelve una necesidad real de este proyecto queda explícitamente fuera (calendario, entornos stage/prod, mail, cron, roles — spec §2 Fuera). | PASS      |

Sin violaciones — no hace falta la tabla de Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-tablero-tareas/
├── plan.md              # este archivo
├── research.md           # Phase 0
├── data-model.md          # Phase 1
├── quickstart.md          # Phase 1
├── contracts/              # Phase 1
│   ├── ipc-tasks.md
│   └── github-rest.md
└── tasks.md               # Phase 2 (/speckit-tasks, no generado acá)
```

### Source Code (repository root)

**Structure Decision**: proyecto único Electron (main/preload/renderer), sin backend/frontend
separados — se extiende con el mismo layout por feature que ya usa el repo
(`src/modules/<feature>` + `src/store/<feature>`), más los tres archivos de Electron main/preload
que necesita cualquier storage nuevo (mismo patrón que `preferences`).

```text
shared/
├── ipcChannels.ts                       # + TASKS_LOAD, TASKS_SAVE
└── vaultEnvelope.types.ts               # + TasksFile, + PreferencesFile.githubTasksToken

electron/main/
├── persistence/
│   ├── vaultPaths.ts                    # + getTasksFilePath()
│   └── tasksStore.ts                    # nuevo: readTasksFile/writeTasksFile
├── ipc/
│   └── tasksHandlers.ts                 # nuevo: registerTasksHandlers()
└── index.ts                             # + registerTasksHandlers()

electron/preload/
└── index.ts                             # + tasksStorageApi (get/set)

src/
├── typings/domain/
│   ├── enums.ts                         # + TaskStatusId, TaskSeverity
│   └── types.ts                         # + Task, TaskLink, TaskCategory, TasksFile
├── validation/
│   ├── taskSchema.ts                    # nuevo (dominio, Zod)
│   ├── taskLinkSchema.ts                # nuevo
│   ├── taskCategorySchema.ts            # nuevo
│   ├── tasksFileSchema.ts               # nuevo (envelope de tasks.json)
│   ├── addTaskFormSchema.ts             # nuevo (formulario)
│   └── addTaskCategoryFormSchema.ts     # nuevo
├── apis/
│   ├── tasksStorageApi.ts               # nuevo: window.tasksStorageApi wrappers
│   └── githubTasksApi.ts                # nuevo: fetch a api.github.com
├── store/
│   ├── tasks/
│   │   ├── tasksSlice.ts                # createEntityAdapter<Task>
│   │   ├── tasksSelectors.ts
│   │   ├── tasksThunks.ts               # loadTasksThunk, saveTasksThunk, syncGithubThunk
│   │   └── typings/{types.ts,enums.ts}
│   ├── taskCategories/
│   │   ├── taskCategoriesSlice.ts
│   │   └── taskCategoriesSelectors.ts
│   ├── middleware/
│   │   └── tasksPersistenceMiddleware.ts # nuevo, análogo a persistenceMiddleware.ts pero para tasks.json
│   └── rootReducer.ts                    # + tasks, taskCategories
├── utils/domain/
│   ├── taskStatuses.ts                   # const TASK_STATUSES (§5.1 del README origen)
│   ├── rankBetween.ts                    # orden fraccional de tarjetas (§5.5 del README origen)
│   ├── buildTaskKey.ts                   # `MIHOGAR-{seq}`
│   ├── suggestBranchName.ts              # `mihogar-{seq}-{slug}`
│   ├── decideTaskTransition.ts           # función pura (§7 del README origen)
│   └── deriveTaskGates.ts                # Mergeado/Aprobado derivados (§8.1, sin entornos)
├── modules/tasks/
│   ├── TasksPage.tsx
│   ├── useTasksData.ts
│   ├── useCreateTask.ts
│   ├── useUpdateTask.ts
│   ├── useMoveTask.ts
│   ├── useArchiveTask.ts
│   ├── useSyncGithub.ts
│   ├── useTaskCategories.ts
│   ├── components/
│   │   ├── TaskBoard.tsx
│   │   ├── TaskColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── AddTaskDialog.tsx
│   │   ├── TaskFormFields.tsx
│   │   ├── TaskDetailDialog.tsx
│   │   ├── TaskLinksSection.tsx
│   │   └── ArchivedTasksList.tsx
│   └── typings/{types.ts,props.ts}
├── modules/settings/
│   ├── components/GithubTokenField.tsx   # nuevo, en SettingsPage
│   └── useGithubTokenPreference.ts       # nuevo
├── router/
│   ├── routes.ts                         # + TASKS: '/tareas'
│   └── AppRouter.tsx                     # + <Route path={ROUTES.TASKS} .../>
└── layout/Sidebar/
    └── useSidebarItems.ts                # + entrada "Tareas"
```

## Complexity Tracking

Sin violaciones de la constitución — tabla no aplica.
