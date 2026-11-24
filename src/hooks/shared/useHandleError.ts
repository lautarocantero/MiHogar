import { useCallback } from 'react'
import { resolveAppErrorMessage } from '@/apis/cloud/errors'
import { StatementImportError } from '@/modules/importStatements/statementImportError'

/** `StatementImportError` (también serializado): su `message` ya viene traducido. */
function resolveStatementImportMessage(error: unknown): string | null {
  if (error instanceof StatementImportError) return error.message || null
  if (typeof error !== 'object' || error === null) return null
  const { name, message } = error as { name?: unknown; message?: unknown }
  return name === 'StatementImportError' && typeof message === 'string' && message ? message : null
}

/**
 * Mensaje para mostrar al usuario. Solo se muestra el texto del error cuando es uno de
 * los nuestros (ya traducido); cualquier otro (Supabase, zod, TypeError...) puede traer
 * detalles técnicos en inglés, así que se usa `fallbackMessage` y el detalle va a consola.
 */
export function useHandleError(): (error: unknown, fallbackMessage: string) => string {
  return useCallback((error: unknown, fallbackMessage: string): string => {
    console.error(error)
    return resolveAppErrorMessage(error) ?? resolveStatementImportMessage(error) ?? fallbackMessage
  }, [])
}
