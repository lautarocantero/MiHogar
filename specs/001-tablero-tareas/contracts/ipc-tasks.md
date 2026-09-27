# Contrato IPC: persistencia de tasks.json

Mismo patrón que `PREFS_GET`/`PREFS_SET` (`shared/ipcChannels.ts:14-15`,
`electron/main/ipc/preferencesHandlers.ts:1-14`).

## Canales nuevos (`shared/ipcChannels.ts`)

```ts
TASKS_LOAD: 'tasks:load'
TASKS_SAVE: 'tasks:save'
```

## Handler (`electron/main/ipc/tasksHandlers.ts`)

```ts
export function registerTasksHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.TASKS_LOAD, () => readTasksFile())
  ipcMain.handle(IPC_CHANNELS.TASKS_SAVE, (_event, tasksFile: TasksFile) =>
    writeTasksFile(tasksFile)
  )
}
```

`readTasksFile`/`writeTasksFile` en `electron/main/persistence/tasksStore.ts`, mismo cuerpo que
`readPreferences`/`writePreferences` (`electron/main/persistence/preferencesStore.ts:12-23`) pero
apuntando a `getTasksFilePath()` (nueva función en `vaultPaths.ts`, mismo patrón que
`getPreferencesFilePath()`) y con default:

```ts
const DEFAULT_TASKS_FILE: TasksFile = {
  version: 1,
  tasks: [],
  categories: DEFAULT_TASK_CATEGORIES,
  nextSeq: 0
}
```

`writeTasksFile` **no** valida — la validación Zod corre en el renderer antes de invocar
`TASKS_SAVE` (mismo principio que `saveVaultThunk` valida con `vaultFileSchema.parse` antes de
llamar a `window.vaultApi.save`, `vaultThunks.ts:73-76`). El proceso main asume que lo que le llega
ya es válido — no hay una segunda validación en el borde de IPC, igual que el resto del repo.

## Preload (`electron/preload/index.ts`)

```ts
const tasksStorageApi = {
  load: (): Promise<TasksFile> => ipcRenderer.invoke(IPC_CHANNELS.TASKS_LOAD),
  save: (tasksFile: TasksFile): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_SAVE, tasksFile)
}
contextBridge.exposeInMainWorld('tasksStorageApi', tasksStorageApi)
export type TasksStorageApi = typeof tasksStorageApi
```

Declarar `window.tasksStorageApi: TasksStorageApi` en el `.d.ts` de tipos globales del preload
(buscar dónde están declarados `window.vaultApi`/`window.preferencesApi` — no se citó en discovery,
confirmar archivo exacto al implementar).

## Consumidor (`src/apis/tasksStorageApi.ts`)

```ts
export function loadTasksFile(): Promise<TasksFile> {
  return window.tasksStorageApi.load()
}
export function saveTasksFile(tasksFile: TasksFile): Promise<void> {
  return window.tasksStorageApi.save(tasksFile)
}
```

## Cuándo se llama

- `loadTasksFile`: una vez, al montar `TasksPage` (`loadTasksThunk`), igual que `useTasksData`
  patrón `useDebtsData` pero sin depender de `vault.status` — el tablero de tareas funciona incluso
  si el vault financiero está bloqueado (son archivos independientes).
- `saveTasksFile`: disparado por `tasksPersistenceMiddleware.ts` en cada acción `tasks/*` o
  `taskCategories/*` que no sea `hydrate*` (mismo filtro que `persistenceMiddleware.ts:23-30`,
  copiado a un middleware separado porque reacciona a un archivo distinto y no depende de
  `state.vault.status`).
