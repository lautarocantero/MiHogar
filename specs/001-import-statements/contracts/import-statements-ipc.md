# Contrato IPC: import de boletas

Mismo patrón que `attachmentsApi` (`electron/preload/index.ts:27-32`,
`shared/ipcChannels.ts:11-13`, `electron/main/ipc/attachmentHandlers.ts:7-19`): el renderer nunca
toca el filesystem ni las librerías de parseo directamente, todo corre en el proceso main.

## `shared/ipcChannels.ts` — canales nuevos

```ts
export const IPC_CHANNELS = {
  // ...existentes...
  IMPORT_STATEMENTS_PICK_FILE: 'importStatements:pickFile',
  IMPORT_STATEMENTS_PARSE: 'importStatements:parse'
} as const
```

## `shared/vaultEnvelope.types.ts` — tipos nuevos

```ts
export type StatementSource = 'MERCADO_PAGO' | 'GALICIA'
export type StatementFileFormat = 'EXCEL_CSV' | 'PDF'

export interface ParseStatementPayload {
  source: StatementSource
  format: StatementFileFormat
  fileData: string // base64, mismo patrón que AttachmentSavePayload.fileData
  fileName: string
}

export interface ParsedStatementRowDto {
  date: string // yyyy-MM-dd, ya normalizado por el parser
  amount: number // signo original del archivo, sin Math.abs todavía
  description: string
  sourceRef?: string
}

export interface ParseStatementResult {
  rows: ParsedStatementRowDto[]
  skippedCount: number // filas descartadas por el parser (ej. en dólares, Galicia) — para mostrar un aviso, no bloquea
}
```

## `electron/main/ipc/importStatementsHandlers.ts` (nuevo)

```ts
ipcMain.handle(IPC_CHANNELS.IMPORT_STATEMENTS_PICK_FILE, async () => {
  // dialog.showOpenDialog, filtros por extensión según fuente/formato elegido en el paso 2 del wizard
  // devuelve { fileData: base64, fileName } o null si el usuario cancela
})

ipcMain.handle(
  IPC_CHANNELS.IMPORT_STATEMENTS_PARSE,
  async (_event, payload: ParseStatementPayload): Promise<ParseStatementResult> => {
    const parser = resolveParser(payload.source, payload.format) // statementParsers/*
    return parser.parse(Buffer.from(payload.fileData, 'base64'))
  }
)
```

`resolveParser` selecciona uno de los 4 parsers de `data-model.md` §5. Si `payload.format` es
`EXCEL_CSV` o `payload.source === 'GALICIA'` con una cuenta común (sin archivo real, diferido),
el parser igual corre con el mapeo de columnas asumido — **no** lanza error por falta de
confirmación, pero su resultado no tiene AC verificado (ver `data-model.md` "Diferido").

## `electron/preload/index.ts` — API nueva expuesta

```ts
const importStatementsApi = {
  pickFile: (): Promise<{ fileData: string; fileName: string } | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_STATEMENTS_PICK_FILE),
  parse: (payload: ParseStatementPayload): Promise<ParseStatementResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_STATEMENTS_PARSE, payload)
}

contextBridge.exposeInMainWorld('importStatementsApi', importStatementsApi)
export type ImportStatementsApi = typeof importStatementsApi
```

## Consumo desde el renderer

`src/modules/importStatements/useImportMovements.ts` (u otro hook de lectura de archivo) llama
`window.importStatementsApi.pickFile()` y luego `.parse(...)`; el resultado (`ParsedStatementRowDto[]`)
se valida contra `parsedStatementRowSchema` (`data-model.md` §2) **antes** de mostrarlo en la
previsualización — el borde de confianza sigue siendo el mismo aunque el dato ya venga "parseado"
por main: IPC no es zona de confianza para Zod (Principio II).
