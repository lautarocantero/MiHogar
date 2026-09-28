import { dialog, ipcMain } from 'electron'
import { readFile } from 'fs/promises'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { ParseStatementPayload, ParseStatementResult } from '@shared/vaultEnvelope.types'
import { resolveParser } from '../persistence/statementParsers'

const FILE_FILTERS = [
  { name: 'Boletas', extensions: ['pdf', 'xlsx', 'xls', 'csv'] },
  { name: 'PDF', extensions: ['pdf'] },
  { name: 'Excel/CSV', extensions: ['xlsx', 'xls', 'csv'] }
]

export function registerImportStatementsHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.IMPORT_STATEMENTS_PICK_FILE, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: FILE_FILTERS
    })
    if (result.canceled || result.filePaths.length === 0) return null

    const filePath = result.filePaths[0]
    const fileBuffer = await readFile(filePath)
    return {
      fileData: fileBuffer.toString('base64'),
      fileName: filePath.split(/[/\\]/).pop() ?? filePath
    }
  })

  ipcMain.handle(
    IPC_CHANNELS.IMPORT_STATEMENTS_PARSE,
    async (_event, payload: ParseStatementPayload): Promise<ParseStatementResult> => {
      const parser = resolveParser(payload.source, payload.format)
      const fileBuffer = Buffer.from(payload.fileData, 'base64')
      return parser.parse(fileBuffer)
    }
  )
}
