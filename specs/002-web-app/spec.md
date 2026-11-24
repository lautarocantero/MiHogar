# 002 — Mi Hogar como web app (multi-dispositivo)

**Estado**: en implementación · **Rama**: `002-feature/web-app` · **Fecha**: 2026-11-20

## Objetivo

Poder ver y editar las finanzas del hogar (ahorros, pagos futuros, cuentas, etc.) desde la PC,
la notebook y el celular con **la misma cuenta**, desde el navegador. La app de escritorio sigue
existiendo como descarga opcional y usa la misma cuenta.

## Decisiones (tomadas con el usuario, 2026-11-20)

| # | Decisión | Elegido | Alternativas descartadas |
|---|----------|---------|--------------------------|
| D1 | Backend | **Supabase** (Auth email+contraseña, Postgres, Storage) | Servidor Node propio, Firebase |
| D2 | Privacidad | **Cifrado de punta a punta**: el navegador cifra con la clave del hogar; el servidor guarda un blob ilegible | Datos en claro protegidos solo por login |
| D3 | Escritorio | **La app de escritorio usa la cuenta nube** (misma UI que la web). Se ofrece subir el vault local existente | Escritorio con modo local + nube |

## Diseño

- **Dos credenciales**: la *cuenta* (email + contraseña de Supabase, identifica y autoriza) y la
  *clave del hogar* (nunca sale del dispositivo; deriva la clave AES). Perder la clave del hogar
  = perder los datos, igual que hoy.
- **Mismo formato de vault**: `VaultEnvelope` v1 (PBKDF2-SHA256 600.000 iteraciones, AES-256-GCM,
  IV 12 bytes, authTag separado). Se implementa con WebCrypto (`crypto.subtle`), así un `.dat`
  exportado desde la app de escritorio se puede importar tal cual en la web y viceversa.
- **Persistencia**: tabla `vaults` (una fila por usuario, `envelope jsonb`, `version`) con RLS.
  Guardado con control de concurrencia optimista (`update ... where version = leída`). Si otro
  dispositivo guardó antes → conflicto → se recarga el vault remoto y se avisa.
- **Guardados**: el middleware de persistencia agrupa (debounce) y serializa los guardados; se
  fuerza el guardado pendiente al ocultar/cerrar la pestaña. Indicador de sincronización visible.
- **Cambios desde otro dispositivo**: al volver a la pestaña (visibilitychange/focus) se compara
  la versión remota; si es más nueva y no hay cambios locales pendientes, se rehidrata.
- **Adjuntos**: se cifran con la clave de sesión y se suben a Storage
  (`attachments/<uid>/<paymentId>/<uuid>__<nombre>`); al abrir se descargan y descifran en memoria.
- **Preferencias** (tamaño de fuente, formato de fecha, recordatorios, idioma): por dispositivo,
  en `localStorage`.
- **Recordatorios**: Web Notifications API (pide permiso).
- **Importar boletas**: los parsers pasan a correr en el navegador (`xlsx` + `pdfjs-dist`); el
  archivo se elige con `<input type="file">`.
- **Escritorio**: Electron carga la misma UI; el main process queda reducido a la ventana y a leer
  el vault local legado (`vault.dat` + adjuntos) para migrarlo a la nube la primera vez.
- **Responsive**: sidebar como drawer en mobile/tablet, contenido adaptable 360px → desktop.
- **i18n**: infraestructura propia mínima (`src/i18n`), ES/EN para todo texto nuevo o tocado.

## Fuera de alcance (por ahora)

- Compartir un mismo hogar entre varias cuentas (pareja con login propio).
- Modo offline completo (service worker con cola de cambios).
- Traducir al inglés las pantallas existentes que no se tocan en esta feature.
- Recuperación de la clave del hogar.
- Envío de mails (confirmación de cuenta y "olvidé mi contraseña"): "Confirm email" va apagado en
  Supabase y la cuenta queda activa al crearla. El código queda comentado con
  `EMAILS DESACTIVADOS` para reactivarlo.

## Constitution Check

Esta feature **redefine el principio I** (prohibía backend y nube) y la sección de restricciones
tecnológicas → enmienda MAJOR de la constitución a 2.0.0 (ver `.specify/memory/constitution.md`).
Se respeta el espíritu del principio: el proveedor nunca puede leer los datos del hogar.
