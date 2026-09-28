# Quickstart: validar el tablero de tareas

Prerrequisitos: rama `001-feature/tablero-tareas`, dependencias instaladas (`yarn`), app
implementada según `plan.md`/`data-model.md`/`contracts/`.

## 1. Chequeos estáticos

```bash
yarn typecheck
yarn lint
```

Ambos deben pasar sin errores nuevos.

## 2. Arrancar la app

```bash
yarn dev
```

## 3. Flujo sin GitHub (no requiere token)

1. Abrir el sidebar → entrar a "Tareas" → confirma que navega a `/tareas`.
2. En la columna _Backlog_, escribir un título y Enter → aparece la tarjeta con key
   `MIHOGAR-1`.
3. Abrir "Nueva tarea" → cargar descripción, severidad, una categoría → guardar → aparece en
   _Backlog_ al final de la columna.
4. Arrastrar una tarjeta de _Backlog_ a _En curso_ → la columna cambia sin recargar.
5. Cerrar la app (o recargar con `Ctrl+R` en dev) y volver a `/tareas` → las tareas creadas siguen
   ahí (confirma que persistieron en `tasks.json`, no en memoria).
6. Verificar el archivo en disco:
   ```bash
   cat "$(node -e "console.log(require('os').homedir())")"/.config/mi-hogar/tasks.json
   ```
   (ajustar la ruta según plataforma — `app.getPath('userData')`; en Linux suele ser
   `~/.config/mi-hogar`). Debe existir y contener las tareas creadas.
7. Abrir el detalle de una tarea, agregar un ítem de checklist y una nota → persisten igual que en
   el paso 5.
8. Archivar una tarea → desaparece del tablero → aparece en la lista de archivadas → restaurar →
   vuelve a su columna.

## 4. Configurar el token de GitHub

1. Ir a Configuración (`/ajustes`) → cargar el token fine-grained (solo lectura, scopes Metadata +
   Pull requests + Issues, limitado a `lautarocantero/MiHogar`) → guardar.
2. Volver a `/tareas` → apretar "Sincronizar GitHub" con **cero** links cargados → no debe romper
   nada, el reporte debe decir 0 descubiertos.

## 5. Flujo con GitHub (requiere el repo real y push access)

1. Crear una tarea de prueba → moverla a _En curso_ → abrir su detalle → copiar el nombre de rama
   sugerido (`mihogar-N-...`).
2. Crear esa rama en `lautarocantero/MiHogar`, abrir un PR (puede ser un PR trivial, ej. un typo en
   un comentario).
3. Volver a `/tareas`, apretar "Sincronizar GitHub" → el link del PR aparece solo en la tarjeta →
   la tarea pasa a _En revisión_ → el check _Mergeado_ sigue apagado.
4. Mergear el PR en GitHub → volver a sincronizar → la tarea pasa a _Hecho_ → check _Mergeado_
   encendido.
5. Mover la tarea de vuelta a _En curso_ a mano → sincronizar de nuevo → **no** vuelve sola a
   _Hecho_ (confirma `decideTaskTransition`, `data-model.md`).
6. Sin token cargado (quitarlo en Configuración) → sincronizar → error legible en el header, el
   resto del tablero sigue funcionando (crear/mover/archivar tareas manualmente).
7. Borrar la tarea y el PR de prueba al terminar.

## 6. Qué falla si algo está mal implementado

- Si `tasks.json` no aparece tras crear una tarea → revisar que `tasksPersistenceMiddleware`
  reacciona al prefijo de acción correcto (`contracts/ipc-tasks.md`).
- Si el vault financiero (`vault.dat`) cambia de tamaño al usar el tablero de tareas → algo se
  coló en `buildVaultFileFromState.ts`/`vaultFileSchema.ts` — no debería (spec §7, último ítem).
- Si sincronizar sin haber tocado nada dispara requests igual al abrir `/tareas` → viola la
  restricción "nunca en un efecto automático" (spec §5, supuesto 6) — revisar que el `useEffect`
  de montaje de `TasksPage` sólo llama a `loadTasksThunk`, nunca a `syncGithubThunk`.
