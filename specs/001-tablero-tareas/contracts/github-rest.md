# Contrato: sync con GitHub REST v3

Corre en el renderer (`src/apis/githubTasksApi.ts`, llamado desde
`src/store/tasks/tasksThunks.ts::syncGithubThunk`). Sin canal IPC (ver `research.md` §3).

## Configuración fija (v1, sin pantalla de settings para esto)

```ts
// src/utils/domain/taskStatuses.ts (o un archivo config dedicado)
export const TASK_KEY_PREFIX = 'MIHOGAR'
export const TASK_GITHUB_REPOS = ['lautarocantero/MiHogar'] as const
```

(spec:141-142, supuestos 3 y 4 — cambiar el prefijo o agregar repos es editar estas dos
constantes, no un rediseño).

## Auth

`Authorization: Bearer <token>`, token leído de `preferences.githubTasksToken`
(`getPreferences()` de `src/apis/preferencesApi.ts`). Si no hay token: el thunk corta antes de
pegarle a la red y despacha un error legible (`showToast`/`setErrorMessage`, patrón ya usado por
`persistenceMiddleware.ts:52-54`) — nunca un 401 crudo en consola.

## Paso 1 — Descubrir (por cada repo de `TASK_GITHUB_REPOS`)

```
GET https://api.github.com/repos/{repo}/pulls?state=all&sort=updated&direction=desc&per_page=30
Headers: Authorization, Accept: application/vnd.github+json
```

Por cada PR de la respuesta: buscar `\bMIHOGAR-(\d+)\b` (case-insensitive) primero en `title`,
después en `head.ref`. Primer match gana. Si hay una tarea con ese `seq` y el PR no está ya
vinculado (`links` sin ese `repo`+`number`), agregar un `TaskLink` nuevo con
`type: 'pr'`, `state` derivado (ver Paso 2 — usar los datos que ya trajo este request, no hace
falta un segundo GET para el link recién descubierto).

**Nunca buscar en el body del PR** (ahí se citan otras tareas — README de origen §6.1-A).

## Paso 2 — Refrescar cada link existente no archivado

Por cada tarea sin `archivedAt` con al menos un link:

```
GET https://api.github.com/repos/{repo}/pulls/{number}
Headers: Authorization, If-None-Match: <link.etag si existe>
```

- `304 Not Modified` → no consume cambios; igual actualizar `syncedAt`.
- `200` → `state`: `'merged'` si `merged_at` no es null; si no, `'draft'` si `draft: true`; si no,
  `'closed'` o `'open'` según `state` de la respuesta. Guardar `etag` del header de respuesta,
  `mergeCommitSha` = `merge_commit_sha`.
- Error de red / 401 / 403 → guardar en `link.syncError`, **conservar** el resto de los campos del
  link tal como estaban (nunca borrar un dato válido por un error de red).

Después, para PRs (no issues):

```
GET https://api.github.com/repos/{repo}/pulls/{number}/reviews?per_page=100
```

`approved` = true si, tomando **la última review de cada reviewer** (ordenadas por
`submitted_at`) y descartando `COMMENTED`/`DISMISSED`/`PENDING`, hay al menos un veredicto y todos
son `APPROVED`. Si la request falla, `approved` queda como estaba (no se pisa con `undefined`).

Un link **no se vuelve a refrescar** (queda "asentado") si es un PR `closed` sin `merged_at` (no
va a cambiar más). v1 no tiene noción de "prod", así que no hay otro caso de asentamiento — todo
PR `open`/`draft`/`merged` reciente se sigue refrescando en cada sync.

## Paso 3 — Aplicar transiciones

Por cada tarea, comparar `links` antes/después de refrescar con `decideTaskTransition`
(`data-model.md`, sección Transiciones automáticas) y mover de columna si corresponde.

## Resolver un issue que en realidad es un PR

Si una URL pegada a mano apunta a `/issues/{n}` pero GitHub devuelve un objeto con campo
`pull_request` presente, es un PR: repetir el Paso 2 contra `/pulls/{n}`, no `/issues/{n}` (README
de origen §6.3 — el `type` sale de la respuesta, nunca de la URL con la que se pegó).

## Rate limit

5000 req/hora autenticado. A esta escala (un repo, cientos de tareas como mucho) es irrelevante —
no hace falta backoff ni cola.

## Reporte del sync

`syncGithubThunk` devuelve `{ discovered: number, refreshed: number, unchanged: number, moved: number, errors: string[] }`
para mostrar un toast resumen (patrón `showToast` ya usado en el resto del repo).
