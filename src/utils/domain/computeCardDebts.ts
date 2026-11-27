import { AccountType, Currency, MovementType } from '@/typings/domain/enums'
import type { Account, Movement } from '@/typings/domain/types'

export const DEFAULT_CARD_BANK_NAME = 'Banco Galicia'

export type CardDebtItem = {
  movementId: string
  concept: string
  date: string
  amount: number
  remaining: number
}

export type CardDebt = {
  account: Account
  bankName: string
  items: CardDebtItem[]
  totalRemaining: number
}

function isArsCardExpense(movement: Movement): boolean {
  return (
    movement.type === MovementType.EXPENSE && (movement.currency ?? Currency.ARS) === Currency.ARS
  )
}

function isCreditCard(account: Account | undefined): account is Account {
  return account?.type === AccountType.CREDIT_CARD
}

/** Remaining unpaid amount per card purchase. Card payments cancel the oldest purchases first. */
export function allocateCardPayments(
  accounts: Account[],
  movements: Movement[]
): Map<string, number> {
  const remainingById = new Map<string, number>()

  accounts.filter(isCreditCard).forEach((account) => {
    const purchases = movements
      .filter((movement) => movement.accountId === account.id && isArsCardExpense(movement))
      .sort((a, b) => a.date.localeCompare(b.date))
    purchases.forEach((purchase) => remainingById.set(purchase.id, purchase.amount))

    movements
      .filter(
        (movement) =>
          movement.accountId === account.id &&
          movement.type === MovementType.CARD_PAYMENT &&
          (movement.currency ?? Currency.ARS) === Currency.ARS
      )
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((payment) => {
        let available = payment.amount
        for (const purchase of purchases) {
          if (available <= 0) break
          if (purchase.date > payment.date) break
          const remaining = remainingById.get(purchase.id) ?? 0
          if (remaining <= 0) continue
          const applied = Math.min(remaining, available)
          remainingById.set(purchase.id, remaining - applied)
          available -= applied
        }
      })
  })

  return remainingById
}

/** One debt per credit card: every unpaid purchase is an item owed to the bank. */
export function computeCardDebts(accounts: Account[], movements: Movement[]): CardDebt[] {
  const remainingById = allocateCardPayments(accounts, movements)

  return accounts.filter(isCreditCard).flatMap((account) => {
    const items = movements
      .filter((movement) => movement.accountId === account.id && isArsCardExpense(movement))
      .map((movement) => ({
        movementId: movement.id,
        concept: movement.note ?? 'Consumo con tarjeta',
        date: movement.date,
        amount: movement.amount,
        remaining: remainingById.get(movement.id) ?? movement.amount
      }))
      .filter((item) => item.remaining > 0)
      .sort((a, b) => a.date.localeCompare(b.date))

    if (items.length === 0) return []
    return [
      {
        account,
        bankName: account.bankName ?? DEFAULT_CARD_BANK_NAME,
        items,
        totalRemaining: items.reduce((sum, item) => sum + item.remaining, 0)
      }
    ]
  })
}
