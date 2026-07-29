// Rôles utilisateur
const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SITE_MANAGER: 'SITE_MANAGER',
  USER: 'USER'
};

// Statuts de projet
const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Statuts de tâche
const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED'
};

// Statuts de facture
const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

// Types de dépenses
const EXPENSE_TYPES = {
  MATERIAL: 'MATERIAL',
  LABOR: 'LABOR',
  EQUIPMENT: 'EQUIPMENT',
  TRANSPORT: 'TRANSPORT',
  OTHER: 'OTHER'
};

// Unités de mesure
const UNITS = {
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

// Priorités
const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Pagination par défaut
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'DESC'
};


// Méthodes de paiement
const PAYMENT_METHODS = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD'
};

// Statuts des devis
const QUOTE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

// Types de mouvement de stock
const MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
  ADJUSTMENT: 'ADJUSTMENT',
  TRANSFER: 'TRANSFER'
};






module.exports = {
  ROLES,
  PROJECT_STATUS,
  TASK_STATUS,
  INVOICE_STATUS,
  EXPENSE_TYPES,
  UNITS,
  PRIORITIES,
 PAYMENT_METHODS,
  QUOTE_STATUS,
  MOVEMENT_TYPES

};