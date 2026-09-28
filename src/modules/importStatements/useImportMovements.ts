import { useCallback, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addManyMovements } from '@/store/movements/movementsSlice'
import { selectAllMovements } from '@/store/movements/movementsSelectors'
import { selectAllAccounts } from '@/store/accounts/accountsSelectors'
import {
  categoryRulesSelectors,
  upsertCategoryRule
} from '@/store/categoryRules/categoryRulesSlice'
import { showToast } from '@/store/ui/uiSlice'
import { useLoader } from '@/hooks/shared/useLoader'
import { MovementType } from '@/typings/domain/enums'
import type { Movement } from '@/typings/domain/types'
import {
  confirmedStatementRowSchema,
  parsedStatementRowSchema
} from '@/validation/importedRowSchema'
import { checkDuplicateRow } from './checkDuplicateRow'
import type {
  ParseStatementResult,
  PreviewRow,
  StatementFileFormat,
  StatementSource
} from './typings/importStatements.types'

/**
 * Regla de signo→tipo por fuente (spec §3 paso 6, data-model.md §5): MP y una cuenta común
 * miden saldo disponible (positivo → INCOME), mientras que un resumen de tarjeta Galicia mide
 * deuda (positivo → EXPENSE, al revés).
 */
function normalizeDescriptionKey(description: string): string {
  return description.trim().toLowerCase()
}

function resolveMovementType(source: StatementSource, amount: number): MovementType {
  if (source === 'GALICIA') {
    return amount > 0 ? MovementType.EXPENSE : MovementType.INCOME
  }
  return amount > 0 ? MovementType.INCOME : MovementType.EXPENSE
}

type UseImportMovementsResult = {
  isLoading: boolean
  error: string | null
  rows: PreviewRow[]
  hasRows: boolean
  canConfirm: boolean
  pickAndParseFile: (
    source: StatementSource,
    format: StatementFileFormat,
    accountId: string
  ) => Promise<void>
  toggleIncluded: (rowId: string) => void
  setCategory: (rowId: string, categoryId: string) => void
  rememberCategory: (rowId: string) => void
  isCategoryRemembered: (rowId: string) => boolean
  confirm: (accountId: string, onDone: () => void) => void
}

export function useImportMovements(): UseImportMovementsResult {
  const dispatch = useAppDispatch()
  const { isLoading, error, run } = useLoader()
  const [rows, setRows] = useState<PreviewRow[]>([])
  const existingMovements = useAppSelector(selectAllMovements)
  const accounts = useAppSelector(selectAllAccounts)
  const categoryRules = useAppSelector((state) =>
    categoryRulesSelectors.selectAll(state.categoryRules)
  )

  const pickAndParseFile = useCallback(
    async (source: StatementSource, format: StatementFileFormat, accountId: string) => {
      await run(async () => {
        const picked = await window.importStatementsApi.pickFile()
        if (!picked) return

        const parseResult: ParseStatementResult = await window.importStatementsApi.parse({
          source,
          format,
          fileData: picked.fileData,
          fileName: picked.fileName
        })

        const nextRows: PreviewRow[] = parseResult.rows.map((dto) => {
          const validation = parsedStatementRowSchema.safeParse(dto)
          const type = resolveMovementType(source, dto.amount)
          const invalid = !validation.success
          const likelyDuplicate =
            !invalid &&
            checkDuplicateRow(existingMovements, {
              date: dto.date,
              amount: dto.amount,
              type,
              accountId
            })

          const matchingRule = categoryRules.find(
            (rule) => rule.descriptionKey === normalizeDescriptionKey(dto.description)
          )

          return {
            ...dto,
            rowId: uuidv4(),
            type,
            categoryId: matchingRule?.categoryId ?? '',
            included: !invalid && !likelyDuplicate,
            likelyDuplicate,
            invalid
          }
        })

        setRows(nextRows)
      }, 'No se pudo leer el archivo')
    },
    [categoryRules, existingMovements, run]
  )

  const toggleIncluded = useCallback((rowId: string) => {
    setRows((prev) =>
      prev.map((row) => (row.rowId === rowId ? { ...row, included: !row.included } : row))
    )
  }, [])

  const setCategory = useCallback((rowId: string, categoryId: string) => {
    setRows((prev) => prev.map((row) => (row.rowId === rowId ? { ...row, categoryId } : row)))
  }, [])

  const rememberCategory = useCallback(
    (rowId: string) => {
      const row = rows.find((candidate) => candidate.rowId === rowId)
      if (!row || !row.categoryId) return

      dispatch(
        upsertCategoryRule({
          id: normalizeDescriptionKey(row.description),
          descriptionKey: normalizeDescriptionKey(row.description),
          categoryId: row.categoryId
        })
      )
    },
    [dispatch, rows]
  )

  const isCategoryRemembered = useCallback(
    (rowId: string) => {
      const row = rows.find((candidate) => candidate.rowId === rowId)
      if (!row || !row.categoryId) return false

      return categoryRules.some(
        (rule) =>
          rule.descriptionKey === normalizeDescriptionKey(row.description) &&
          rule.categoryId === row.categoryId
      )
    },
    [categoryRules, rows]
  )

  const canConfirm = useMemo(
    () => rows.some((row) => row.included) && rows.every((row) => !row.included || row.categoryId),
    [rows]
  )

  const confirm = useCallback(
    (accountId: string, onDone: () => void) => {
      run(async () => {
        const account = accounts.find((candidate) => candidate.id === accountId)
        if (!account) throw new Error('Cuenta destino no encontrada')

        const includedRows = rows.filter((row) => row.included)

        const movements: Movement[] = includedRows.map((row) => {
          const confirmedRow = confirmedStatementRowSchema.parse({
            date: row.date,
            amount: row.amount,
            description: row.description,
            sourceRef: row.sourceRef,
            categoryId: row.categoryId,
            accountId,
            type: row.type,
            ownerType: account.ownerType,
            ownerId: account.ownerId
          })

          return {
            id: uuidv4(),
            type: confirmedRow.type,
            amount: Math.abs(confirmedRow.amount),
            date: confirmedRow.date,
            accountId: confirmedRow.accountId,
            categoryId: confirmedRow.categoryId,
            ownerType: confirmedRow.ownerType,
            ownerId: confirmedRow.ownerId,
            isImported: true,
            note: confirmedRow.description
          }
        })

        dispatch(addManyMovements(movements))
        dispatch(showToast(`Se importaron ${movements.length} movimientos`))
        setRows([])
        onDone()
      }, 'No se pudo confirmar la importación')
    },
    [accounts, dispatch, rows, run]
  )

  return {
    isLoading,
    error,
    rows,
    hasRows: rows.length > 0,
    canConfirm,
    pickAndParseFile,
    toggleIncluded,
    setCategory,
    rememberCategory,
    isCategoryRemembered,
    confirm
  }
}
