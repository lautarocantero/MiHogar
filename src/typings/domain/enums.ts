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
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ONCE = 'ONCE'
}

export enum PaymentKind {
  EXPENSE = 'EXPENSE',
  DEPOSIT = 'DEPOSIT'
}

export enum AmountMode {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE'
}

export enum MovementType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
  CARD_PAYMENT = 'CARD_PAYMENT'
}

export enum Currency {
  ARS = 'ARS',
  USD = 'USD'
}

export enum CategoryKind {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME'
}

export enum DebtDirection {
  OWED_BY_HOUSEHOLD = 'OWED_BY_HOUSEHOLD',
  OWED_TO_HOUSEHOLD = 'OWED_TO_HOUSEHOLD'
}

export enum DebtStatus {
  ACTIVE = 'ACTIVE',
  PAID_OFF = 'PAID_OFF'
}

export enum TaskStatusId {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  BLOCKED = 'blocked',
  DONE = 'done'
}

export enum TaskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
