# Mi Hogar

App de escritorio (Electron + React + TypeScript) para llevar las finanzas de un hogar: cuentas, pagos, ahorros, proyecciones y reportes en un solo lugar, con los datos cifrados y guardados localmente.

## Características

- **Cuentas**: administrá las cuentas del hogar (bancarias, efectivo, etc.).
- **Pagos**: registro y seguimiento de pagos, con detalle por pago y recordatorios (notificaciones de pagos pendientes).
- **Movimientos**: altas rápidas de ingresos/gastos ("Quick Add").
- **Ahorros**: seguimiento de instrumentos de ahorro.
- **Proyección**: proyección de saldos futuros según pagos y movimientos planificados.
- **Calendario y línea de tiempo**: visualización temporal de pagos y movimientos.
- **Reportes**: gráficos y resúmenes (MUI X Charts).
- **Multi-miembro**: soporte para varios integrantes del hogar.
- **Adjuntos**: guardado de comprobantes/archivos asociados a pagos.
- **Datos cifrados localmente**: toda la información se guarda en un "vault" (archivo JSON cifrado) protegido por una clave del hogar, derivada con una función criptográfica y sin backend ni almacenamiento en la nube.

## Stack técnico

- [Electron](https://www.electronjs.org/) + [electron-vite](https://electron-vite.org/) — empaquetado y proceso principal/preload.
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/) + [react-redux](https://react-redux.js.org/) — estado global.
- [React Router](https://reactrouter.com/) (`HashRouter`) — ruteo.
- [Material UI (MUI)](https://mui.com/) + [MUI X Charts](https://mui.com/x/react-charts/) — UI y gráficos.
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) / [Yup](https://github.com/jquense/yup) — formularios y validación.
- Node `crypto` (main process) — derivación de clave y cifrado/descifrado del vault.

## Estructura del proyecto

```
electron/
  main/           # Proceso principal: IPC, cifrado del vault, persistencia, notificaciones
  preload/        # Puente seguro entre main y renderer
src/
  modules/        # Un módulo por feature (accounts, payments, savings, projection, reports, calendar, timeline, onboarding, settings, quickAdd, home)
  store/          # Slices de Redux Toolkit
  layout/         # Header, Sidebar, layout general de la app
  router/         # Rutas de la app
  theme/          # Tema de MUI y escalado de fuentes
  apis/           # Acceso a APIs internas (bridge con el proceso main)
  utils/, validation/, typings/, hooks/
shared/           # Tipos y canales de IPC compartidos entre main y renderer
resources/        # Ícono de la app
```

## Requisitos

- Node.js 20+ (el proyecto no funciona bien con Node 18; usar `nvm use 20` si tenés `nvm`).
- [Yarn](https://yarnpkg.com/) (el repo usa `yarn.lock`).

## Instalación

```bash
nvm use 20
yarn install
```

## Desarrollo

```bash
yarn dev
```

Levanta la app en modo desarrollo con hot-reload (electron-vite).

## Otros scripts

```bash
yarn lint        # ESLint sobre .ts/.tsx
yarn typecheck   # Chequeo de tipos (main + renderer)
yarn format      # Prettier sobre todo el repo
```

## Build / empaquetado

```bash
yarn build            # Compila main + renderer (electron-vite build)
yarn build:unpack     # Build + empaquetado sin instalador (carpeta suelta)
yarn build:linux      # Empaqueta AppImage (Linux)
yarn build:win        # Empaqueta instalador NSIS (Windows)
yarn build:mac        # Empaqueta DMG (macOS)
```

Los binarios generados quedan en `release/` (configurado en `electron-builder.yml`).

## Descargar el instalador

Cada vez que se publica un tag `vX.Y.Z`, un workflow de GitHub Actions (`.github/workflows/release.yml`) compila los instaladores para Windows, macOS y Linux y los sube automáticamente a la sección [Releases](https://github.com/lautarocantero/MiHogar/releases) del repo. Desde ahí se puede descargar el instalador correspondiente sin necesidad de compilar el proyecto.

Para publicar una nueva versión:

```bash
git tag v1.0.0
git push origin v1.0.0
```

También se puede disparar manualmente desde la pestaña Actions (`workflow_dispatch`).

## Seguridad y datos

Los datos del hogar se guardan localmente en un archivo cifrado (vault), no hay servidor ni sincronización en la nube. Al crear el hogar se define una clave que se usa para derivar la clave de cifrado; sin esa clave no es posible desencriptar el archivo. Se recomienda no perder la clave del hogar, ya que no hay forma de recuperarla.

## Licencia

Proyecto privado (`UNLICENSED`) — Lautaro Cantero.
