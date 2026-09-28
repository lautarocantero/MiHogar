---
feature: 001-tablero-tareas
pendiente: trabajo suelto
rama: 001-feature/tablero-tareas
fecha: 2026-09-27
estado: borrador
---

## 1. Qué es

Un tablero kanban interno, dentro de miHogar, para que Lautaro (único usuario de la app) lleve
bugs, ideas y deuda técnica del propio proyecto. Vive en una pantalla propia de la app
(`/tareas`), separado de los datos financieros del hogar. Cada tarea tiene un id legible
(`MIHOGAR-1`), severidad, categorías y, opcionalmente, un PR o issue de GitHub vinculado. Cuando
se sincroniza, el tablero lee de la API de GitHub si ese PR está abierto, mergeado o aprobado, y
mueve la tarjeta de columna sola según esos cambios — nadie tilda "mergeado" a mano.

Adaptado de `/home/lautaro/Downloads/READMEdashboard.md` (kit original: Express + MongoDB + React
web multiusuario) al caso real de miHogar: Electron de escritorio, un solo usuario, sin servidor.

## 2. Alcance

### Dentro

- CRUD de tareas: título, descripción, estado, severidad, categorías, repos, fechas
  (`startDate`/`dueDate`), checklist, notas.
- Vista kanban (`TaskBoard`): columnas por estado, drag & drop nativo, alta rápida en la primera
  columna, mover con teclado.
- Categorías de tarea editables (catálogo propio, no las categorías financieras existentes),
  sembradas con Bug/Feature/QA/Chore.
- Vincular un PR o issue de GitHub a una tarea: pegando la URL, o por key (`MIHOGAR-N`) en el
  título/rama del PR durante el sync.
- Botón "Sincronizar GitHub": descubre PRs por key, refresca estado de cada link ya vinculado
  (abierto/cerrado/mergeado, aprobado por review), aplica las dos transiciones automáticas del
  README (§7): PR abierto y tarea en curso → revisión; todos los PRs mergeados → hecho. Una tarea
  reabierta a mano no vuelve sola a "hecho".
- Dos checks derivados en la tarjeta: **Mergeado** y **Aprobado** (nunca tildables a mano).
- Filtros de cliente (texto/key, categoría, severidad, vencidas) y archivar/restaurar.
- Persistencia en un archivo separado, sin cifrar, en la misma carpeta que `vault.dat`
  (`app.getPath('userData')`), con su propio canal IPC (no toca el vault cifrado ni sus schemas).
- Token de GitHub (fine-grained, solo lectura) guardado en `preferences.json` y cargado por el
  usuario desde una pantalla de configuración simple.

### Fuera (se deja para después)

- **Vista calendario** por deadline (arrastrar para reprogramar). El README la describe en
  `TaskCalendar`; no entra en v1.
- **Checks de entorno** (`testedStage`/`testedProd`, `environment` derivado de GitHub Deployments
  y ancestría de commits, §8.2 del README). No aplica sin un pipeline de deploy con Deployments
  configurados para este repo, y agrega la complejidad de mapear entornos.
- **Escenarios de prueba** (`scenarios`, lo que enciende los checks de entorno). Cae junto con los
  checks de entorno, ya que es su única función en el README.
- **Notificaciones por mail** y **cron diario de vencidas** (§11 del README). No hay mailer en
  miHogar ni backend donde correr un cron; posible reemplazo futuro por notificación de escritorio
  nativa de Electron, pero no en v1.
- **Roles / `super_admin`** (§12 del README). No aplica: miHogar es de un solo usuario, sin login
  multiusuario.
- **Vinculación de issue que arrastra sus PRs por timeline** (README §6.1-C). Se deja para una
  iteración futura; v1 sólo descubre PRs por key/URL y refresca links ya cargados.

## 3. Cómo debería funcionar

1. Lautaro entra a "Tareas" desde el menú/sidebar de miHogar.
2. En _Backlog_ escribe un título y Enter para soltar una idea, o abre "Nueva tarea" para cargar
   todo (descripción, severidad, categorías, repos, fechas).
3. Mueve la tarjeta a "En curso" cuando empieza a trabajarla. El detalle le muestra el nombre de
   rama sugerido (`mihogar-3-titulo-corto`) con botón de copiar.
4. Abre el PR con esa rama o con `MIHOGAR-3` en el título.
5. Aprieta "Sincronizar GitHub" en el header: el link aparece solo en la tarea, que pasa a "En
   revisión"; cuando el PR se mergea y sincroniza de nuevo, pasa a "Hecho" y el check _Mergeado_ se
   enciende.
6. Si reabre la tarea a mano después de "Hecho", el sync siguiente no la vuelve a cerrar solo.
7. Puede archivar tareas que ya no le interesan y restaurarlas desde una lista aparte.
8. Antes del primer sync, si no cargó el token de GitHub en Configuración, el botón de sync
   muestra un error claro (no una pantalla rota) y el resto del tablero funciona igual.

> ⚠ Depende del supuesto 3 (§5): sin token no hay sync, pero sí CRUD manual completo.

## 4. Datos

⚠ Depende del supuesto 1 y 2 (§5).

- **Nuevo archivo de storage**: `tasks.json`, en `app.getPath('userData')` (misma carpeta que
  `vault.dat`, `vault.dat.bak`, `preferences.json` — ver
  `electron/main/persistence/vaultPaths.ts:4-22`). Forma:
  `{ version: 1, tasks: TaskDoc[], categories: TaskCategory[], nextSeq: number }`. No cifrado, no
  depende de que el vault esté desbloqueado.
- **Canales IPC nuevos** en `shared/ipcChannels.ts` (siguiendo el patrón de
  `PREFS_GET`/`PREFS_SET`, `shared/ipcChannels.ts:14-15`): `TASKS_LOAD`, `TASKS_SAVE`. Handler
  nuevo `electron/main/ipc/tasksHandlers.ts`, persistencia nueva
  `electron/main/persistence/tasksStore.ts` (misma forma que
  `electron/main/persistence/preferencesStore.ts`), registrado en `electron/main/index.ts` junto a
  `registerPreferencesHandlers()`. Expuesto en `electron/preload/index.ts` como `tasksStorageApi`.
- **`preferences.json`**: se extiende `PreferencesFile` (`shared/vaultEnvelope.types.ts:11-15`)
  con `githubTasksToken?: string`. No requiere IPC nuevo, reusa `PREFS_GET`/`PREFS_SET`.
- **Redux**: dos slices nuevos, `src/store/tasks/tasksSlice.ts` y
  `src/store/tasks/taskCategoriesSlice.ts`, con `createEntityAdapter` (mismo patrón que
  `src/store/debts/debtsSlice.ts` — leído en discovery). **No** se agregan a
  `buildVaultFileFromState.ts` ni a `vaultFileSchema.ts`: no viajan con el vault cifrado. Se
  hidratan con sus propios thunks (`loadTasksThunk`) al montar la página, y se guardan con un
  `saveTasksThunk` propio disparado por una copia reducida de `persistenceMiddleware.ts` que
  reacciona a los prefijos `tasks/`/`taskCategories/` (no `vault.status`).
- **GitHub**: sin canal IPC nuevo. El sync corre en el renderer con `fetch` directo a
  `api.github.com`, usando el token leído de `preferences.json` vía `preferencesApi.get()`
  (`src/apis/preferencesApi.ts`).
- **Ruta nueva**: `/tareas` en `src/router/routes.ts` + `AppRouter.tsx`, entrada en el
  sidebar (`src/layout/Sidebar/useSidebarItems.ts` — no leído en detalle, confirmar forma exacta al
  implementar).

## 5. Supuestos

1. **El storage de tasks va en archivo propio sin cifrar, misma carpeta que el vault.** Decisión
   explícita del usuario en la entrevista (no vault cifrado, no `preferences.json`). Si fuera
   falso, todo el diseño de IPC/persistencia de §4 cambia (se plegaría al vault o a preferencias).
2. **El token de GitHub vive en `preferences.json`.** Decisión explícita del usuario. Si fuera
   falso (ej. quisiera `.env`), habría que agregar carga de variables de entorno al proceso main,
   que hoy no existe (`electron.vite.config.ts:10-23` no define `envDir` para `main`).
3. **El prefijo de key es `MIHOGAR`** (no se preguntó explícitamente). Se infiere del nombre del
   proyecto/repo (`lautarocantero/MiHogar`, confirmado con `git remote -v`). Si el usuario prefiere
   otro prefijo (`APP`, `HOGAR`), es un cambio de una constante, no de diseño.
4. **El catálogo de repos para el sync es sólo `lautarocantero/MiHogar`** (único repo del proyecto,
   confirmado por `git remote -v`). Si en el futuro hay más repos (ej. una landing aparte,
   mencionada en "Por agregar" de `docs/pending.md`), el catálogo es un array y se extiende sin
   rediseño.
5. **No hay `deployableRepos`/entornos en v1** (§2, Fuera). Si el usuario después configura CI/CD
   con GitHub Deployments para este repo, el check de entorno se puede agregar como iteración 2 sin
   tocar el modelo de datos base (los links ya guardan `mergeCommitSha`).
6. **El sync se dispara sólo con un botón** (`POST /sync-github` → acá, un thunk manual), nunca en
   un efecto automático al abrir la pantalla — mismo principio no negociable del README (§18):
   "El sync corre sólo en `POST /sync-github`, nunca dentro de un GET". Aplica igual en el
   renderer: nunca en el `useEffect` de montaje de `TasksPage`.
7. **La ruta se llama `/tareas`** siguiendo el patrón en español de `src/router/routes.ts`
   (`/pagos`, `/deudas-y-prestamos`, `/ajustes`). Si el usuario prefiere otro nombre, es un cambio
   de constante.

## 6. Preguntas abiertas

Ninguna bloqueante: los dos rounds de entrevista (máximo permitido) cubrieron todas las decisiones
de diseño necesarias para empezar. Las Fuera de alcance (§2) y los supuestos 3, 4 y 7 (§5) son
ajustables sin rediseño si el usuario los corrige durante la implementación.

## 7. Acceptance criteria

- `yarn typecheck` y `yarn lint` pasan sin errores nuevos después de agregar los slices, la
  página, el router y los handlers de Electron.
- Con la app corriendo (`yarn dev`):
  - Se ve "Tareas" en el sidebar y navega a `/tareas`.
  - Crear una tarea desde _Backlog_ la persiste: cerrar y reabrir la app (o recargar) la sigue
    mostrando (lee de `tasks.json` en `userData`, no del vault).
  - Mover una tarjeta entre columnas por drag & drop persiste el nuevo estado.
  - Sin token de GitHub cargado en Configuración, "Sincronizar GitHub" muestra un error legible sin
    romper el resto del tablero.
  - Con token cargado: crear una rama `mihogar-N-prueba`, abrir un PR real contra
    `lautarocantero/MiHogar`, sincronizar → el link aparece solo en la tarea `MIHOGAR-N` y pasa a
    "En revisión". Mergear el PR, sincronizar de nuevo → pasa a "Hecho", check _Mergeado_ encendido.
  - Mover esa tarea de vuelta a "En curso" a mano y sincronizar de nuevo → no vuelve sola a
    "Hecho".
- El vault financiero (`vault.dat`) no cambia de tamaño ni de schema al usar el tablero de tareas
  (verificable inspeccionando que `vaultFileSchema.ts` y `buildVaultFileFromState.ts` no se
  tocaron).

## 8. Contexto medido

**KNOWN**

- Autosave del vault por prefijo de acción, excluyendo `hydrate*`:
  `src/store/middleware/persistenceMiddleware.ts:8-19,29-38`.
- Todas las colecciones del vault se combinan en `buildVaultFileFromState.ts:1-27` y se validan con
  `vaultFileSchema.ts:13-24` (cada colección `z.array(...).default([])`).
- Patrón de slice de dominio con `createEntityAdapter`: `src/store/categories/categoriesSlice.ts`
  (leído completo en discovery), mismo patrón en `src/store/debts` (`useCreateDebt.ts`,
  `typings/types.ts` leídos).
- Persistencia sin cifrar existente (`preferences.json`): `electron/main/persistence/
preferencesStore.ts:1-23`, IPC en `electron/main/ipc/preferencesHandlers.ts:1-14`, canales
  `PREFS_GET`/`PREFS_SET` en `shared/ipcChannels.ts:14-15`, tipo `PreferencesFile` en
  `shared/vaultEnvelope.types.ts:11-15`, expuesto en `electron/preload/index.ts:36-40,49`.
- Rutas de archivos de storage: `electron/main/persistence/vaultPaths.ts:4-22` (todas en
  `app.getPath('userData')`).
- Registro de handlers IPC al boot: `electron/main/index.ts:29-47`.
- Rutas de la app: `src/router/routes.ts:1-12`, `src/router/AppRouter.tsx` (lazy pages, confirmado
  al leer el archivo completo en discovery).
- Repo GitHub real: `git remote -v` → `https://github.com/lautarocantero/MiHogar.git`.
- No hay `.env`/dotenv cargado en el proceso main: `electron.vite.config.ts:10-23` sólo define
  alias `@shared`, sin `envDir` ni plugin de env para `main`; `.gitignore` lista `.env`/`.env.local`
  pero no hay archivo `.env*` presente en la raíz del repo (`find . -maxdepth 1 -name ".env*"` sin
  resultados).
- `docs/pending.md` no menciona el tablero de tareas (leído completo, 549 palabras).

**NO MEDIDO**

- Forma exacta de `src/layout/Sidebar/useSidebarItems.ts` (qué icono/estructura usar para agregar
  la entrada "Tareas"). Se cierra al implementar, leyendo ese archivo antes de tocarlo.
- Si GitHub Actions o algún otro proceso ya crea Deployments para `lautarocantero/MiHogar` (afecta
  sólo a la iteración futura de checks de entorno, fuera de v1): no se corrió
  `gh api repos/lautarocantero/MiHogar/deployments`. No bloquea v1 porque los entornos están fuera
  de alcance.
- Formato exacto de límites de campos (título ≤200, etc., §4.6 del README original): se toman como
  referencia razonable pero no fueron pedidos por el usuario; se definen en la validación Zod al
  implementar, no bloquean el spec.
