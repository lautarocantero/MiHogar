export enum AccountType {
  BANK = 'BANK',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD'
}

export enum OwnerType {
  MEMBER = 'MEMBER',
  HOUSEHOLD = 'HOUSEHOLD'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID'
}

export enum PaymentFrequency {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ONCE = 'ONCE'
}

export enum MovementType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER'
}

export enum CategoryKind {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME'
}
