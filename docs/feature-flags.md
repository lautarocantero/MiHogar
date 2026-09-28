# Feature flags

## VITE_ENABLE_TASKS

Sección "Tareas" (kanban + sync GitHub) es de uso personal. Oculta por default para que no aparezca en las apps de otros usuarios.

- Off (default): sin item en sidebar, sin ruta `/tareas`, sin campo de token GitHub en Ajustes.
- On: todo visible.

Flag: `src/utils/featureFlags.ts` → `IS_TASKS_ENABLED = import.meta.env.VITE_ENABLE_TASKS === 'true'`
Usado en: `src/layout/Sidebar/useSidebarItems.ts`, `src/router/AppRouter.tsx`, `src/modules/settings/SettingsPage.tsx`

### Uso local (dev)
`.env.local` (gitignoreado) en la raíz con:
```
VITE_ENABLE_TASKS=true
```
`yarn dev` lo lee automáticamente.

### Build personal (con Tareas)
```
yarn build:linux:personal
```

### Build para distribuir a otros (sin Tareas)
```
yarn build:linux
yarn build:win
yarn build:mac
```
(sin la env var → flag off)
