import { v4 as uuidv4 } from 'uuid'
import { t } from '@/i18n'
import { CategoryKind } from '@/typings/domain/enums'
import type { Category } from '@/typings/domain/types'

// Se crean con el nombre en el idioma activo: después son datos del usuario (no se traducen).
const DEFAULT_EXPENSE_CATEGORY_KEYS = [
  'format.defaultCategory.services',
  'format.defaultCategory.housing',
  'format.defaultCategory.groceries',
  'format.defaultCategory.transport',
  'format.defaultCategory.health',
  'format.defaultCategory.otherExpenses'
]

const DEFAULT_INCOME_CATEGORY_KEYS = [
  'format.defaultCategory.salary',
  'format.defaultCategory.otherIncome'
]

export function buildDefaultCategories(): Category[] {
  const expenseCategories = DEFAULT_EXPENSE_CATEGORY_KEYS.map((key) => ({
    id: uuidv4(),
    name: t(key),
    kind: CategoryKind.EXPENSE
  }))
  const incomeCategories = DEFAULT_INCOME_CATEGORY_KEYS.map((key) => ({
    id: uuidv4(),
    name: t(key),
    kind: CategoryKind.INCOME
  }))
  return [...expenseCategories, ...incomeCategories]
}
