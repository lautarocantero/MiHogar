import { addDays, format, startOfDay, subDays } from 'date-fns'
import type { VaultFile } from '@/typings/domain/types'
import {
  AccountType,
  AmountMode,
  CategoryKind,
  MovementType,
  OwnerType,
  PaymentFrequency,
  PaymentKind,
  PaymentStatus
} from '@/typings/domain/enums'

const MEMBER_ANA = 'demo-member-ana'
const MEMBER_MARTIN = 'demo-member-martin'
const MEMBER_SOFIA = 'demo-member-sofia'

const ACCOUNT_CUENTA_SUELDO = 'demo-acc-cuenta-sueldo'
const ACCOUNT_TARJETA_VISA = 'demo-acc-tarjeta-visa'
const ACCOUNT_EFECTIVO = 'demo-acc-efectivo'
const ACCOUNT_TARJETA_MASTER = 'demo-acc-tarjeta-master'

const CATEGORY_SERVICIOS = 'demo-cat-servicios'
const CATEGORY_VIVIENDA = 'demo-cat-vivienda'
const CATEGORY_SUPER = 'demo-cat-super'
const CATEGORY_TRANSPORTE = 'demo-cat-transporte'
const CATEGORY_SALUD = 'demo-cat-salud'
const CATEGORY_COLEGIO = 'demo-cat-colegio'
const CATEGORY_OTROS_GASTOS = 'demo-cat-otros-gastos'
const CATEGORY_SUELDO = 'demo-cat-sueldo'
const CATEGORY_OTROS_INGRESOS = 'demo-cat-otros-ingresos'

function isoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function buildDemoVaultFile(): VaultFile {
  const today = startOfDay(new Date())

  return {
    version: 1,
    household: { name: 'Familia Fernández' },
    members: [
      { id: MEMBER_ANA, name: 'Ana Fernández', colorTag: '#ab5e2b' },
      { id: MEMBER_MARTIN, name: 'Martín Gómez', colorTag: '#3f6a8a' },
      { id: MEMBER_SOFIA, name: 'Sofía Gómez', colorTag: '#6a7851' }
    ],
    accounts: [
      {
        id: ACCOUNT_CUENTA_SUELDO,
        name: 'Cuenta sueldo Banco Nación',
        type: AccountType.BANK,
        ownerType: OwnerType.HOUSEHOLD,
        balance: 862500,
        contextPhrase: 'Cuenta principal del hogar'
      },
      {
        id: ACCOUNT_TARJETA_VISA,
        name: 'Visa Banco Galicia',
        type: AccountType.CREDIT_CARD,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_ANA,
        balance: 0,
        sourceAccountId: ACCOUNT_CUENTA_SUELDO,
        creditLimit: 375000,
        usedAmount: 375000,
        closingDay: 20,
        dueDay: 10,
        nextClosingDay: 22,
        nextDueDay: 12
      },
      {
        id: ACCOUNT_EFECTIVO,
        name: 'Efectivo',
        type: AccountType.CASH,
        ownerType: OwnerType.HOUSEHOLD,
        balance: 52000
      },
      {
        id: ACCOUNT_TARJETA_MASTER,
        name: 'Mastercard Banco Galicia',
        type: AccountType.CREDIT_CARD,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_MARTIN,
        balance: 0,
        sourceAccountId: ACCOUNT_CUENTA_SUELDO,
        creditLimit: 152000,
        usedAmount: 61000,
        closingDay: 5,
        dueDay: 15
      }
    ],
    categories: [
      { id: CATEGORY_SERVICIOS, name: 'Servicios', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_VIVIENDA, name: 'Alquiler o vivienda', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_SUPER, name: 'Súper', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_TRANSPORTE, name: 'Transporte', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_SALUD, name: 'Salud', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_COLEGIO, name: 'Colegio', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_OTROS_GASTOS, name: 'Otros gastos', kind: CategoryKind.EXPENSE },
      { id: CATEGORY_SUELDO, name: 'Sueldo', kind: CategoryKind.INCOME },
      { id: CATEGORY_OTROS_INGRESOS, name: 'Otros ingresos', kind: CategoryKind.INCOME }
    ],
    payments: [
      {
        id: 'demo-pay-sueldo-ana',
        concept: 'Sueldo Ana',
        entity: 'Estudio Contable Rivas',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_ANA,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(subDays(today, 15)),
        amount: 650000,
        status: PaymentStatus.PAID,
        categoryId: CATEGORY_SUELDO,
        attachments: [],
        kind: PaymentKind.DEPOSIT,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-sueldo-martin',
        concept: 'Sueldo Martín',
        entity: 'Transportes del Sur SA',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_MARTIN,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(subDays(today, 15)),
        amount: 720000,
        status: PaymentStatus.PAID,
        categoryId: CATEGORY_SUELDO,
        attachments: [],
        kind: PaymentKind.DEPOSIT,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-alquiler',
        concept: 'Alquiler',
        entity: 'Inmobiliaria Del Valle',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.HOUSEHOLD,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(subDays(today, 10)),
        amount: 380000,
        status: PaymentStatus.PAID,
        categoryId: CATEGORY_VIVIENDA,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-colegio',
        concept: 'Cuota colegio Sofía',
        entity: 'Instituto San Martín',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_SOFIA,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(subDays(today, 6)),
        amount: 95000,
        status: PaymentStatus.PAID,
        categoryId: CATEGORY_COLEGIO,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-internet',
        concept: 'Internet y cable',
        entity: 'Fibertel',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.HOUSEHOLD,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(subDays(today, 4)),
        amount: 12500,
        status: PaymentStatus.PAID,
        categoryId: CATEGORY_SERVICIOS,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-luz',
        concept: 'Factura de luz',
        entity: 'Edesur',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.HOUSEHOLD,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(addDays(today, 2)),
        amount: 15400,
        status: PaymentStatus.PENDING,
        categoryId: CATEGORY_SERVICIOS,
        attachments: [],
        reminderEnabled: true,
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-tarjeta-visa',
        concept: 'Resumen tarjeta Visa',
        entity: 'Banco Galicia',
        accountId: ACCOUNT_TARJETA_VISA,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_ANA,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(addDays(today, 5)),
        amount: 125000,
        status: PaymentStatus.PENDING,
        categoryId: CATEGORY_OTROS_GASTOS,
        attachments: [],
        reminderEnabled: true,
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-gas',
        concept: 'Factura de gas',
        entity: 'Metrogas',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.HOUSEHOLD,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(addDays(today, 9)),
        amount: 8200,
        status: PaymentStatus.PENDING,
        categoryId: CATEGORY_SERVICIOS,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      },
      {
        id: 'demo-pay-super',
        concept: 'Súper del mes',
        entity: 'Supermercado Coto',
        accountId: ACCOUNT_EFECTIVO,
        ownerType: OwnerType.HOUSEHOLD,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(addDays(today, 14)),
        amount: 120000,
        status: PaymentStatus.PENDING,
        categoryId: CATEGORY_SUPER,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.VARIABLE
      },
      {
        id: 'demo-pay-heladera',
        concept: 'Heladera en cuotas',
        entity: 'Frávega',
        accountId: ACCOUNT_TARJETA_MASTER,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_MARTIN,
        recurring: true,
        frequency: PaymentFrequency.MONTHLY,
        dueDate: isoDate(addDays(today, 8)),
        amount: 38000,
        status: PaymentStatus.PENDING,
        categoryId: CATEGORY_OTROS_GASTOS,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED,
        installmentsTotal: 6,
        installmentsPaid: 5
      },
      {
        id: 'demo-pay-seguro-auto',
        concept: 'Seguro del auto',
        entity: 'La Caja Seguros',
        accountId: ACCOUNT_CUENTA_SUELDO,
        ownerType: OwnerType.HOUSEHOLD,
        recurring: false,
        frequency: PaymentFrequency.ONCE,
        dueDate: isoDate(addDays(today, 20)),
        amount: 45000,
        status: PaymentStatus.PENDING,
        categoryId: CATEGORY_TRANSPORTE,
        attachments: [],
        kind: PaymentKind.EXPENSE,
        amountMode: AmountMode.FIXED
      }
    ],
    movements: [
      {
        id: 'demo-mov-sueldo-ana',
        type: MovementType.INCOME,
        amount: 650000,
        date: isoDate(subDays(today, 15)),
        accountId: ACCOUNT_CUENTA_SUELDO,
        categoryId: CATEGORY_SUELDO,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_ANA,
        paymentId: 'demo-pay-sueldo-ana',
        note: 'Sueldo Ana'
      },
      {
        id: 'demo-mov-sueldo-martin',
        type: MovementType.INCOME,
        amount: 720000,
        date: isoDate(subDays(today, 15)),
        accountId: ACCOUNT_CUENTA_SUELDO,
        categoryId: CATEGORY_SUELDO,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_MARTIN,
        paymentId: 'demo-pay-sueldo-martin',
        note: 'Sueldo Martín'
      },
      {
        id: 'demo-mov-alquiler',
        type: MovementType.EXPENSE,
        amount: 380000,
        date: isoDate(subDays(today, 10)),
        accountId: ACCOUNT_CUENTA_SUELDO,
        categoryId: CATEGORY_VIVIENDA,
        ownerType: OwnerType.HOUSEHOLD,
        paymentId: 'demo-pay-alquiler',
        note: 'Alquiler'
      },
      {
        id: 'demo-mov-colegio',
        type: MovementType.EXPENSE,
        amount: 95000,
        date: isoDate(subDays(today, 6)),
        accountId: ACCOUNT_CUENTA_SUELDO,
        categoryId: CATEGORY_COLEGIO,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_SOFIA,
        paymentId: 'demo-pay-colegio',
        note: 'Cuota colegio Sofía'
      },
      {
        id: 'demo-mov-internet',
        type: MovementType.EXPENSE,
        amount: 12500,
        date: isoDate(subDays(today, 4)),
        accountId: ACCOUNT_CUENTA_SUELDO,
        categoryId: CATEGORY_SERVICIOS,
        ownerType: OwnerType.HOUSEHOLD,
        paymentId: 'demo-pay-internet',
        note: 'Internet y cable'
      },
      {
        id: 'demo-mov-super-mes-pasado',
        type: MovementType.EXPENSE,
        amount: 118000,
        date: isoDate(subDays(today, 40)),
        accountId: ACCOUNT_EFECTIVO,
        categoryId: CATEGORY_SUPER,
        ownerType: OwnerType.HOUSEHOLD,
        note: 'Súper del mes pasado'
      },
      {
        id: 'demo-mov-transferencia-efectivo',
        type: MovementType.TRANSFER,
        amount: 20000,
        date: isoDate(subDays(today, 12)),
        accountId: ACCOUNT_CUENTA_SUELDO,
        toAccountId: ACCOUNT_EFECTIVO,
        ownerType: OwnerType.HOUSEHOLD,
        note: 'Retiro de efectivo'
      }
    ],
    savingsInstruments: [
      {
        id: 'demo-sav-plazo-fijo',
        name: 'Plazo fijo Banco Nación',
        principal: 300000,
        monthlyInterestEstimate: 11250,
        rateAnnual: 0.45,
        maturityDate: isoDate(addDays(today, 30)),
        liquidAnytime: false,
        ownerType: OwnerType.HOUSEHOLD,
        colorTag: '#ab5e2b'
      },
      {
        id: 'demo-sav-fci',
        name: 'Fondo común de inversión',
        principal: 150000,
        rateAnnual: 0.38,
        liquidAnytime: true,
        ownerType: OwnerType.MEMBER,
        ownerId: MEMBER_ANA,
        colorTag: '#6a7851'
      }
    ],
    notifications: []
  }
}
