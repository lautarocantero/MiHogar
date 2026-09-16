# AppImage no abre en Linux: "SUID sandbox helper... not configured correctly"

## Síntoma

La app empaquetada como AppImage no abre al hacer click en el ícono (GNOME Shell,
dock, o doble-click directo en el archivo). A veces abre, a veces no
(comportamiento intermitente). Ejecutada a mano desde una terminal con
`--no-sandbox` sí funciona.

En `journalctl` (o en la terminal si se corre a mano) aparece:

```
[PID:FECHA/HORA:FATAL:setuid_sandbox_host.cc(163)] The SUID sandbox helper
binary was found, but is not configured correctly. Rather than run without
sandboxing I'm aborting now. You need to make sure that
/tmp/.mount_XXXXXXXX/chrome-sandbox is owned by root and has mode 4755.
```

## Causa raíz

Chromium (usado por Electron) quiere sandboxear el proceso renderer a nivel
de SO. Eso requiere un helper `chrome-sandbox` con permisos `setuid root`
(`chown root:root` + `chmod 4755`). Un AppImage corrido sin "instalación"
(sin `sudo`) nunca tiene ese binario configurado así — se ejecuta con los
permisos del usuario normal.

Hay dos formas de evitar que Chromium intente usar ese sandbox:

1. **Flag global de proceso**: `app.commandLine.appendSwitch('no-sandbox')`
   en el proceso main de Electron (JS), antes de `app.whenReady()`.
2. **Flag por ventana**: `webPreferences.sandbox` en `BrowserWindow`. Si se
   deja en `true` (o no se especifica, porque desde Electron 20 el default
   es `true`), Electron agrega `--enable-sandbox` **específicamente para
   ese renderer**, lo cual puede pisar/contradecir el `--no-sandbox` global
   dependiendo de la versión de Electron/Chromium.

El problema real, encontrado en Mi Hogar, tiene dos capas:

- **`sandbox: true` en `webPreferences`** competía con el `--no-sandbox`
  global y en algunos casos forzaba el intento de sandboxing del renderer
  de todas formas.
- Aunque se corrigiera eso, **el `appendSwitch('no-sandbox')` hecho desde
  JS llega demasiado tarde**: el chequeo nativo de Chromium sobre el
  binario SUID ocurre muy temprano en el arranque del proceso, antes de que
  el script principal de Electron (JS) llegue a ejecutarse. Confirmado
  empíricamente: ejecutar el AppImage sin argumentos siempre fallaba con el
  FATAL, incluso con el código JS "correcto"; ejecutarlo pasando
  `--no-sandbox` como argumento de línea de comandos (antes de que el
  proceso arranque) siempre funcionaba.

Adicionalmente, esto se vuelve más probable (o directamente consistente) en
distros con Ubuntu 24.04+ / kernels recientes, que restringen la creación
de *user namespaces* sin privilegios vía AppArmor — Chromium depende de esa
capacidad como alternativa al sandbox SUID, y si el kernel la deniega,
termina cayendo en el chequeo SUID que falla igual.

## Cómo se diagnosticó

1. Reproducir el launch real (no solo desde una terminal interactiva):
   `gio launch <archivo>.desktop`, `gtk-launch <id>`, o
   `systemd-run --user --scope -- <binario>` — así se simula cómo lo
   invoca GNOME Shell (via `systemd` scope), que es un entorno distinto al
   de una shell interactiva y puede exponer restricciones (namespaces,
   cgroups) que no aparecen corriendo el binario a mano.
2. Revisar `journalctl --user --since "..."` en vez de solo la salida de
   terminal — los crashes reales del usuario quedan ahí con el mensaje
   completo, incluso si el proceso fue lanzado por GNOME Shell y no por una
   shell interactiva.
3. Comparar contra otros proyectos Electron del mismo autor que sí abrían
   bien (Kat, TheConnectionV2): ninguno de los dos setea `sandbox` en
   `webPreferences` — confirma que tocar esa opción es lo que introduce el
   riesgo.
4. Extraer el AppImage (`--appimage-extract`) y el `app.asar` empaquetado
   para confirmar qué código quedó realmente compilado en el binario
   instalado, en vez de asumir que el código fuente actual coincide con lo
   que corre el usuario.

## Fix aplicado

1. **`electron/main/windowManager.ts`**: `sandbox: true` → `sandbox: false`
   en `webPreferences`. La app no carga contenido remoto, así que
   `contextIsolation: true` + `nodeIntegration: false` ya cubren el
   límite de seguridad relevante; el sandbox de proceso de Chromium es
   redundante acá y es la pieza que dispara el chequeo SUID.

2. **Wrapper de shell inyectado en el build** (`scripts/afterPack.cjs`,
   enganchado vía `afterPack:` en `electron-builder.yml`): después de
   empaquetar, renombra el binario real `mi-hogar` → `mi-hogar.bin` y lo
   reemplaza por un script que siempre re-ejecuta el binario real con
   `--no-sandbox`:

   ```sh
   #!/bin/sh
   DIR="$(cd "$(dirname "$0")" && pwd)"
   exec "$DIR/mi-hogar.bin" --no-sandbox "$@"
   ```

   Esto garantiza que el flag esté presente **desde el primer exec del
   proceso**, sin importar cómo se invoque el AppImage (ícono de GNOME,
   doble-click en el archivo, `.desktop` con o sin el flag, terminal sin
   argumentos). Es la única capa que realmente resuelve el problema de
   timing — confiar solo en JS (`appendSwitch`) no alcanza.

3. `~/.local/share/applications/mihogar.desktop` (config local, no vive en
   el repo): se agregó `--no-sandbox` al `Exec=` como refuerzo adicional,
   y se corrigió `StartupWMClass` (decía `Mi Hogar`, la ventana real usa
   `mi-hogar`) — esto es cosmético/complementario, no fue lo que resolvió
   el bug de fondo.

## Checklist para futuros proyectos Electron + AppImage en Linux

- [ ] **No** setear `sandbox: true` explícito en `webPreferences` de
      `BrowserWindow` a menos que la app cargue contenido remoto no
      confiable y de verdad necesites ese aislamiento — si no, dejarlo en
      `false` o no tocarlo si el default de esa versión de Electron ya es
      manejable.
- [ ] Si el flag de sandbox se maneja vía `app.commandLine.appendSwitch()`
      en JS, asumir que **no es suficiente por sí solo** para AppImages no
      instalados — agregar un `afterPack` hook (como el de este repo) que
      envuelva el binario real y fuerce `--no-sandbox` a nivel de proceso.
- [ ] Para probar si "abre el ícono" de verdad funciona, no alcanza con
      correr el binario a mano desde una terminal — hay que simular el
      lanzador real (`gio launch`, `gtk-launch`, o `systemd-run --scope`) y
      revisar `journalctl --user`, porque el entorno de systemd/cgroups que
      usa GNOME Shell puede comportarse distinto a una shell interactiva.
- [ ] Si un proyecto similar (mismo autor, mismo stack) sí funciona,
      comparar `webPreferences`, flags de Chromium, y el `Exec=` del
      `.desktop` antes de asumir que el problema es de sistema operativo.
