# Research: Tablero de tareas interno

No quedan `NEEDS CLARIFICATION` en el Technical Context del plan — todas las decisiones de
arquitectura ya se cerraron en la entrevista de `/spec` (`spec.md` §5) y pasaron la revisión
independiente (`spec-review.md`, veredicto PASS). Este documento registra el porqué técnico de
cada elección, para quien implemente sin haber estado en la entrevista.

## 1. Dónde vive el storage de tasks

**Decisión**: archivo propio `tasks.json` en `app.getPath('userData')`, sin cifrar, mismo patrón
que `preferences.json`.

**Rationale**: `electron/main/persistence/preferencesStore.ts:1-23` ya resuelve exactamente este
problema (leer/escribir un JSON en `userData`, con defaults si no existe) para datos que no son
financieros. Copiar ese patrón para `tasks.json` es la opción de menor código nuevo y no exige
tocar el vault cifrado (`vaultFileSchema.ts`, `buildVaultFileFromState.ts`), que es exactamente lo
que el Principio I protege.

**Alternativas consideradas**:

- _Dentro del vault cifrado_ — descartada explícitamente por el usuario en la entrevista: las
  tareas no son datos del hogar y no tiene sentido que requieran la household key para leerse.
- _`localStorage`/IndexedDB del renderer_ — descartada porque el resto de la app persiste todo vía
  IPC + `fs` en el proceso main (nunca storage del navegador), y mezclar dos mecanismos de
  persistencia para un solo proyecto viola el Principio V (YAGNI: no introducir un mecanismo nuevo
  cuando el existente alcanza).

## 2. Dónde vive el token de GitHub

**Decisión**: campo nuevo `githubTasksToken?: string` en `PreferencesFile`
(`shared/vaultEnvelope.types.ts:11-15`), leído/escrito con los canales `PREFS_GET`/`PREFS_SET` ya
existentes (`shared/ipcChannels.ts:14-15`).

**Rationale**: no requiere IPC nuevo. `preferences.json` ya es el lugar donde vive configuración de
la app que no es ni financiera ni de tareas (`fontSizeLevel`, `remindersEnabled`).

**Alternativas consideradas**:

- _Variable de entorno `.env`_ — descartada: `electron.vite.config.ts:10-23` no define `envDir`
  para el build de `main`, así que hoy nada carga `.env` en ese proceso; agregarlo es más código
  para un beneficio menor (el usuario ya tiene que escribir el token en algún lado la primera vez).
- _`tasks.json`_ — descartada por separar responsabilidades: el token es configuración de la app
  (como las demás preferencias), no un dato del dominio "tareas".

## 3. Dónde corre el sync con GitHub

**Decisión**: `fetch` directo desde el renderer (`src/apis/githubTasksApi.ts`), sin canal IPC.

**Rationale**: Electron con `contextIsolation` no impide `fetch` en el renderer — es una llamada
HTTPS normal de Chromium, no requiere Node. Evita agregar un canal IPC nuevo sólo para pasar el
mismo request/response que ya puede hacer el renderer directo, y mantiene el mismo principio del
README de origen: "el sync corre sólo en una acción explícita, nunca en un efecto automático"
(spec §5, supuesto 6) — ese principio es independiente de en qué proceso corra el `fetch`.

**Alternativas consideradas**:

- _IPC hacia `main`_ — más seguro en el sentido de que el token nunca llega al bundle del
  renderer, pero para una app de un solo usuario en su propia máquina, con un token de sólo
  lectura, el costo (canal IPC nuevo, handler, preload, mapeo de errores) no se paga. Documentado
  como opción descartada en la entrevista.

## 4. Orden de las tarjetas dentro de una columna

**Decisión**: `rank: number` (float), igual al README de origen (§5.5): al soltar entre A y B,
`rank = (A + B) / 2`; al principio `B - 1000`; al final `A + 1000`; rebalanceo si el hueco baja de
`1e-9`.

**Rationale**: no existe ningún mecanismo de orden manual por drag & drop en el repo hoy (los
módulos existentes —pagos, deudas, cuentas— no tienen listas reordenables a mano), así que no hay
patrón previo que reutilizar; se porta el algoritmo del README de origen tal cual, que ya resuelve
escrituras concurrentes con un solo documento tocado por movimiento.

**Alternativas consideradas**:

- _Índice entero + reescritura de toda la columna al mover_ — descartada: reescribe N documentos
  por cada drag en vez de uno, y el README de origen ya documenta por qué (§5.5, "dos altas
  simultáneas empatan").

## 5. Verificación sin test runner

**Decisión**: `yarn typecheck` + `yarn lint` como gate automático, y los pasos manuales de
`quickstart.md` como gate funcional.

**Rationale**: `package.json` no define script `test` ni tiene `vitest`/`jest`/`@testing-library/*`
instalado (`grep -E '"test"|vitest|jest' package.json` sin resultados) — no hay infraestructura de
tests en el repo hoy. Agregar un runner de tests sólo para esta feature sería una decisión de
alcance mayor a la del propio spec (violaría el Principio V si no hay una necesidad ya
documentada). Los acceptance criteria del spec (§7) ya están escritos como pasos manuales
verificables, no como aserciones de test.
