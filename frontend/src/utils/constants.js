// Rôles
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SITE_MANAGER: 'SITE_MANAGER',
  USER: 'USER'
};

// Statuts des projets
export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Statuts des tâches
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED'
};

// Statuts des factures
export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

// Types de dépenses
export const EXPENSE_TYPES = {
  MATERIAL: 'MATERIAL',
  LABOR: 'LABOR',
  EQUIPMENT: 'EQUIPMENT',
  TRANSPORT: 'TRANSPORT',
  OTHER: 'OTHER'
};

// Unités de mesure
export const UNITS = {
  UNIT: 'UNIT',
  KG: 'KG',
  TON: 'TON',
  M: 'M',
  M2: 'M2',
  M3: 'M3',
  L: 'L',
  HOUR: 'HOUR',
  DAY: 'DAY'
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD'
};

// Priorités
export const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [5, 10, 25, 50, 100]
};

// Options de sélection
export const getSelectOptions = (enumObject) => {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ')
  }));
};