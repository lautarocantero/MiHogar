import { v4 as uuidv4 } from 'uuid'
import { CategoryKind } from '@/typings/domain/enums'
import type { Category } from '@/typings/domain/types'

const DEFAULT_EXPENSE_CATEGORY_NAMES = [
  'Servicios',
  'Alquiler o vivienda',
  'Súper',
  'Transporte',
  'Salud',
  'Otros gastos'
]

const DEFAULT_INCOME_CATEGORY_NAMES = ['Sueldo', 'Otros ingresos']

export function buildDefaultCategories(): Category[] {
  const expenseCategories = DEFAULT_EXPENSE_CATEGORY_NAMES.map((name) => ({
    id: uuidv4(),
    name,
    kind: CategoryKind.EXPENSE
  }))
  const incomeCategories = DEFAULT_INCOME_CATEGORY_NAMES.map((name) => ({
    id: uuidv4(),
    name,
    kind: CategoryKind.INCOME
  }))
  return [...expenseCategories, ...incomeCategories]
}
