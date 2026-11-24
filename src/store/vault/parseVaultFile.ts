import type { ZodIssue } from 'zod'
import { AppError } from '@/apis/cloud/errors'
import { vaultFileSchema } from '@/validation/vaultFileSchema'
import type { VaultFile } from '@/typings/domain/types'

export type ParsedVaultFile = {
  vaultFile: VaultFile
  /** Se corrigieron números dañados (hay que avisarle al usuario). */
  repaired: boolean
}

const MAX_REPAIR_ROUNDS = 3

type Container = Record<string | number, unknown>

function resolveParent(root: unknown, path: (string | number)[]): Container | null {
  let current: unknown = root
  for (const segment of path.slice(0, -1)) {
    if (typeof current !== 'object' || current === null) return null
    current = (current as Container)[segment]
  }
  return typeof current === 'object' && current !== null ? (current as Container) : null
}

/** Valor que deja pasar a un número que no cumple el mínimo / máximo del esquema. */
function clampTarget(issue: ZodIssue): number | null {
  if (issue.code === 'too_small' && issue.type === 'number') {
    const minimum = Number(issue.minimum)
    return issue.inclusive ? minimum : minimum + 1
  }
  if (issue.code === 'too_big' && issue.type === 'number') {
    const maximum = Number(issue.maximum)
    return issue.inclusive ? maximum : maximum - 1
  }
  return null
}

/**
 * Corrige en el lugar los números dañados que reporta zod: `null` (un `Infinity` que
 * `JSON.stringify` guardó como `null`) → 0, fuera de rango → al borde del rango,
 * decimales en un entero → redondeo. Devuelve si cambió algo.
 */
function repairNumericIssues(root: unknown, issues: ZodIssue[]): boolean {
  let changed = false
  for (const issue of issues) {
    const parent = resolveParent(root, issue.path)
    if (!parent || issue.path.length === 0) continue
    const key = issue.path[issue.path.length - 1]
    const value = parent[key]
    let next: number | null = null
    if (issue.code === 'invalid_type' && issue.expected === 'number' && value === null) {
      next = 0
    } else if (issue.code === 'invalid_type' && issue.expected === 'integer') {
      next = typeof value === 'number' ? Math.round(value) : null
    } else if (typeof value === 'number') {
      next = clampTarget(issue)
    }
    if (next !== null && Number.isFinite(next) && next !== value) {
      parent[key] = next
      changed = true
    }
  }
  return changed
}

/**
 * Valida lo que viene descifrado. Si solo tiene números dañados (p. ej. un vault viejo
 * con `null` donde iba un monto) los corrige para que el vault se pueda abrir igual y
 * avisa con `repaired`; si tiene otra forma, el archivo está dañado.
 */
export function parseVaultFile(raw: unknown): ParsedVaultFile {
  const first = vaultFileSchema.safeParse(raw)
  if (first.success) return { vaultFile: first.data, repaired: false }

  let candidate: unknown
  try {
    candidate = JSON.parse(JSON.stringify(raw))
  } catch {
    throw new AppError('vaultErrors.corrupted', { cause: first.error })
  }
  let issues = first.error.issues
  for (let round = 0; round < MAX_REPAIR_ROUNDS; round += 1) {
    if (!repairNumericIssues(candidate, issues)) break
    const result = vaultFileSchema.safeParse(candidate)
    if (result.success) return { vaultFile: result.data, repaired: true }
    issues = result.error.issues
  }
  throw new AppError('vaultErrors.corrupted', { cause: first.error })
}
