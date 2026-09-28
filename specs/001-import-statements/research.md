# Research: Carga de boletas

## 1. Librería de parseo Excel/CSV

**Decision**: `xlsx` (SheetJS, community edition, paquete npm `xlsx`).

**Rationale**: única dependencia sin runtime extra (puro JS/WASM), corre en Node (proceso main)
sin binarios nativos que compilar — importante en un proyecto Electron empaquetado con
`electron-builder` para 3 plataformas. Soporta `.xlsx` y `.csv` con la misma API
(`XLSX.read`/`XLSX.utils.sheet_to_json`), lo que cubre ambos formatos de Excel/CSV del alcance
(§2 del spec) con una sola dependencia (Supuesto 3, §5 del spec: "como máximo una librería de
Excel/CSV").

**Alternatives considered**:

- `exceljs`: más pesada, pensada para generar/editar `.xlsx` (streaming de escritura), no aporta
  nada extra para sólo leer filas.
- Parsers de CSV a mano (`csv-parse`): no cubriría `.xlsx`, habría que sumar una segunda
  dependencia — viola el "como máximo una" del Supuesto 3.

## 2. Librería de extracción de texto de PDF

**Decision**: `pdf-parse@1.1.1` (extracción de texto plano, sin dependencias nativas).

**Nota de implementación**: `pdf-parse@2.x` reescribió el paquete sobre `pdfjs-dist` y agrega
`@napi-rs/canvas` como dependencia **dura** (para `getScreenshot`, que no se usa acá) — eso trae
un binario nativo precompilado por plataforma, justo lo que esta decisión buscaba evitar para no
complicar `electron-builder`. Se fija la versión en `1.1.1` (la última v1, API `pdf(buffer)`,
sin `@napi-rs/canvas`) en vez de `^2.0.0`.

**Rationale**: corre en Node puro (proceso main), sin binarios nativos — evita problemas de
empaquetado con `electron-builder`/`electron-vite` (que si hiciera falta compilar un binario
nativo por plataforma complicaría el build, fuera del alcance de este feature). Los dos archivos
reales medidos (spec §8) son texto embebido, no imágenes escaneadas — no hace falta OCR.

**Alternatives considered**:

- `pdfjs-dist` (el motor de Firefox/Chrome para PDF): más pesado y pensado para renderizar, no
  sólo extraer texto; API más compleja para el caso de uso (texto plano con layout tabular).
- OCR (`tesseract.js`): innecesario — los archivos reales no son escaneos, y agregar OCR sería
  sobre-ingeniería para este alcance (Principio V, YAGNI).

**Riesgo conocido** (no bloquea el plan, a validar en Phase 1/implementación): `pdf-parse`
devuelve texto por posición de línea, no una tabla estructurada — el parser de cada fuente
(`mercadoPagoPdfParser.ts`, `galiciaTarjetaPdfParser.ts`) tiene que reconstruir filas con
expresiones regulares/heurísticas sobre el texto plano, como ya se hizo manualmente al medir los
dos archivos de ejemplo con `pdftotext -layout` en este mismo research (ver `data-model.md` para
el mapeo columna→campo confirmado).

## 3. Empaquetado de las nuevas dependencias en `electron-vite`

**Decision**: ambas dependencias (`xlsx`, `pdf-parse`) van en `dependencies` del `package.json`
raíz (no `devDependencies`) y se importan sólo desde código que corre en el proceso main
(`electron/main/persistence/statementParsers/*`), nunca desde `src/` (renderer) — mismo patrón
que `electron/main/persistence/attachmentsStorage.ts` no tiene equivalente en el renderer.

**Rationale**: `electron-vite` compila main/preload/renderer por separado; una dependencia usada
sólo en main no infla el bundle del renderer. Evita cualquier necesidad de exponerla vía
`contextBridge` (Principio I: el archivo cruza al main vía IPC como buffer/base64, igual que
`AttachmentSavePayload.fileData`, `shared/vaultEnvelope.types.ts:20`, y el parseo nunca toca el
renderer).

**Alternatives considered**: parsear en el renderer (descartado explícitamente por el Supuesto 2
del spec, §5 — mantiene el precedente de que todo acceso a filesystem/parseo pesado corre en
main).

## 4. Reconstrucción de tabla desde texto plano de PDF (hallazgo de la medición real)

**Decision**: cada parser de PDF (`mercadoPagoPdfParser.ts`, `galiciaTarjetaPdfParser.ts`) usa
una regex por tipo de línea, no un parser genérico de tablas.

**Rationale — MP**: cada fila de movimiento en el texto extraído sigue el patrón `dd-mm-yyyy` +
descripción + ID numérico de operación + `$ <monto>` + `$ <saldo>` en líneas consecutivas (ver
`data-model.md`). Una regex ancla en la fecha al inicio de línea y consume las siguientes N
líneas hasta el próximo ancla de fecha.

**Rationale — Galicia (tarjeta)**: dos tipos de línea a reconocer por separado, ambos
confirmados con el archivo real:

1. Detalle de consumo: `dd-mm-aa` + (opcional `*`/`K`) + referencia + (opcional `CUOTA` tipo
   `NN/NN`) + comprobante + monto en columna `PESOS` o `DÓLARES`.
2. Líneas sueltas fuera de la tabla (saldo anterior, pagos, impuestos/intereses/percepciones):
   mismo formato de fecha + descripción + monto, sin columna `CUOTA` ni `COMPROBANTE`.
   Una fila cuyo monto cae en la posición/columna de `DÓLARES` se descarta (Supuesto 5 del spec).

**Alternatives considered**: extraer con coordenadas x/y de cada palabra (que `pdf-parse` no
expone; requeriría `pdfjs-dist`) — descartado, mismo motivo que en la sección 2 (sobre-ingeniería
para el volumen y regularidad de estos dos formatos reales).

## Resumen — NEEDS CLARIFICATION resueltos

Ningún ítem del Technical Context quedó como `NEEDS CLARIFICATION`: las dos librerías están
decididas (secciones 1-2), el proceso de ejecución está confirmado (sección 3, ya era un
Supuesto del spec), y el enfoque de parseo de PDF está resuelto con evidencia de los archivos
reales medidos en el spec v9-v13 (sección 4).
