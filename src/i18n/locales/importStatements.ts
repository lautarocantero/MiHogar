import type { LocaleNamespace } from '../types'

export const importStatements = {
  es: {
    'importStatements.title': 'Importar boleta',
    'importStatements.subtitle': 'Elegí la fuente, la cuenta destino y subí el archivo del resumen',
    'importStatements.field.source': 'Fuente',
    'importStatements.field.format': 'Formato del archivo',
    'importStatements.field.account': 'Cuenta destino',
    'importStatements.format.PDF': 'PDF',
    'importStatements.format.EXCEL_CSV': 'Excel / CSV',
    'importStatements.upload.button': 'Subir archivo',
    'importStatements.upload.hint.PDF': 'Archivo PDF de hasta {maxMb} MB',
    'importStatements.upload.hint.EXCEL_CSV': 'Archivo .xlsx, .xls o .csv de hasta {maxMb} MB',
    'importStatements.upload.hint.noAccount': 'Elegí primero la cuenta destino',
    'importStatements.preview.title': 'Previsualización',
    'importStatements.preview.col.include': 'Incluir',
    'importStatements.preview.col.date': 'Fecha',
    'importStatements.preview.col.description': 'Descripción',
    'importStatements.preview.col.amount': 'Monto',
    'importStatements.preview.col.category': 'Categoría',
    'importStatements.preview.col.notice': 'Aviso',
    'importStatements.preview.includeRow': 'Incluir movimiento: {description}',
    'importStatements.preview.rememberCategory': 'Establecer concepto',
    'importStatements.preview.rememberCategory.done': 'Concepto establecido para esta descripción',
    'importStatements.preview.rememberCategory.hint':
      'Establecer concepto para futuras boletas con esta descripción',
    'importStatements.preview.invalidRow': 'Fila inválida',
    'importStatements.preview.likelyDuplicate': 'Probable duplicado',
    'importStatements.preview.empty': 'No se detectaron filas en el archivo.',
    'importStatements.confirm': 'Confirmar importación',
    'importStatements.toast.imported': 'Se importaron {count} movimientos',
    'importStatements.error.readFailed': 'No se pudo leer el archivo',
    'importStatements.error.confirmFailed': 'No se pudo confirmar la importación',
    'importStatements.error.accountNotFound': 'Cuenta destino no encontrada',
    'importStatements.error.tooLarge':
      'El archivo pesa {sizeMb} MB y el máximo es {maxMb} MB. Probá exportar un período más corto.',
    'importStatements.error.empty': 'El archivo está vacío.',
    'importStatements.error.wrongFormat.PDF':
      'Elegiste el formato PDF pero el archivo no es un PDF. Cambiá el formato o elegí otro archivo.',
    'importStatements.error.wrongFormat.EXCEL_CSV':
      'Elegiste el formato Excel / CSV pero el archivo no es .xlsx, .xls ni .csv. Cambiá el formato o elegí otro archivo.',
    'importStatements.error.unreadable':
      'No se pudo abrir el archivo. Puede que se haya movido o que el navegador no tenga permiso para leerlo.',
    'importStatements.error.invalidPdf': 'El archivo no es un PDF válido o está dañado.',
    'importStatements.error.passwordProtected':
      'El PDF está protegido con contraseña. Descargá una versión sin contraseña desde tu banco.',
    'importStatements.error.invalidSpreadsheet':
      'No se pudo leer la planilla. Verificá que sea un .xlsx, .xls o .csv válido.',
    'importStatements.error.parseFailed':
      'No se pudo procesar el archivo. Verificá que sea un resumen de la fuente elegida.',
    'importStatements.error.noRows':
      'No se encontraron movimientos en el archivo. Verificá que la fuente y el formato elegidos coincidan con el resumen.'
  },
  en: {
    'importStatements.title': 'Import statement',
    'importStatements.subtitle':
      'Choose the source and the target account, then upload the statement file',
    'importStatements.field.source': 'Source',
    'importStatements.field.format': 'File format',
    'importStatements.field.account': 'Target account',
    'importStatements.format.PDF': 'PDF',
    'importStatements.format.EXCEL_CSV': 'Excel / CSV',
    'importStatements.upload.button': 'Upload file',
    'importStatements.upload.hint.PDF': 'PDF file up to {maxMb} MB',
    'importStatements.upload.hint.EXCEL_CSV': '.xlsx, .xls or .csv file up to {maxMb} MB',
    'importStatements.upload.hint.noAccount': 'Choose the target account first',
    'importStatements.preview.title': 'Preview',
    'importStatements.preview.col.include': 'Include',
    'importStatements.preview.col.date': 'Date',
    'importStatements.preview.col.description': 'Description',
    'importStatements.preview.col.amount': 'Amount',
    'importStatements.preview.col.category': 'Category',
    'importStatements.preview.col.notice': 'Notice',
    'importStatements.preview.includeRow': 'Include transaction: {description}',
    'importStatements.preview.rememberCategory': 'Set category',
    'importStatements.preview.rememberCategory.done': 'Category set for this description',
    'importStatements.preview.rememberCategory.hint':
      'Set category for future statements with this description',
    'importStatements.preview.invalidRow': 'Invalid row',
    'importStatements.preview.likelyDuplicate': 'Likely duplicate',
    'importStatements.preview.empty': 'No rows were found in the file.',
    'importStatements.confirm': 'Confirm import',
    'importStatements.toast.imported': '{count} transactions imported',
    'importStatements.error.readFailed': 'The file could not be read',
    'importStatements.error.confirmFailed': 'The import could not be confirmed',
    'importStatements.error.accountNotFound': 'Target account not found',
    'importStatements.error.tooLarge':
      'The file is {sizeMb} MB and the limit is {maxMb} MB. Try exporting a shorter period.',
    'importStatements.error.empty': 'The file is empty.',
    'importStatements.error.wrongFormat.PDF':
      'You chose the PDF format but the file is not a PDF. Change the format or pick another file.',
    'importStatements.error.wrongFormat.EXCEL_CSV':
      'You chose the Excel / CSV format but the file is not .xlsx, .xls or .csv. Change the format or pick another file.',
    'importStatements.error.unreadable':
      'The file could not be opened. It may have been moved, or the browser is not allowed to read it.',
    'importStatements.error.invalidPdf': 'The file is not a valid PDF or it is damaged.',
    'importStatements.error.passwordProtected':
      'The PDF is password protected. Download a version without a password from your bank.',
    'importStatements.error.invalidSpreadsheet':
      'The spreadsheet could not be read. Make sure it is a valid .xlsx, .xls or .csv file.',
    'importStatements.error.parseFailed':
      'The file could not be processed. Make sure it is a statement from the selected source.',
    'importStatements.error.noRows':
      'No transactions were found in the file. Make sure the selected source and format match the statement.'
  }
} satisfies LocaleNamespace
