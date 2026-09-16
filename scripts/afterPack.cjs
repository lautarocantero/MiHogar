const fs = require('fs')
const path = require('path')

// El AppImage no queda instalado con el helper chrome-sandbox setuid root
// que Chromium exige para sandboxear el renderer. index.ts intenta
// deshabilitar el sandbox vía app.commandLine.appendSwitch('no-sandbox'),
// pero ese código JS corre después de que Chromium ya hizo su chequeo nativo
// del sandbox SUID durante el arranque del proceso: en hosts con AppArmor
// restringiendo user namespaces sin privilegios (Ubuntu 24.04+), ese
// chequeo puede fallar de forma intermitente y abortar con
// "SUID sandbox helper... not configured correctly" antes de que el flag
// JS llegue a aplicarse. La única forma confiable de que --no-sandbox esté
// presente es que esté en el argv desde el exec inicial del proceso, sin
// importar cómo se invoque el binario (ícono, doble click, terminal).
//
// Este hook renombra el binario real a "<name>.bin" y lo reemplaza por un
// wrapper de shell que siempre agrega --no-sandbox antes de re-execarlo.
exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'linux') return

  const executableName = context.packager.executableName
  const outDir = context.appOutDir
  const realBinary = path.join(outDir, executableName)
  const renamedBinary = path.join(outDir, `${executableName}.bin`)

  if (!fs.existsSync(realBinary)) return

  fs.renameSync(realBinary, renamedBinary)

  const wrapper = `#!/bin/sh
DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$DIR/${executableName}.bin" --no-sandbox "$@"
`
  fs.writeFileSync(realBinary, wrapper, { mode: 0o755 })
}
