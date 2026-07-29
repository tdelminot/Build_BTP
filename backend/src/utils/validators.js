const { body, param, query } = require('express-validator');

// Validateurs communs
const validateId = (field = 'id') => {
  return param(field)
    .isUUID()
    .withMessage(`L'${field} doit être un UUID valide`);
};

const validateEmail = () => {
  return body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide')
    .isLength({ max: 100 })
    .withMessage('L\'email ne peut pas dépasser 100 caractères');
};

const validatePassword = () => {
  return body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');
};

// Schémas de validation
const createProjectValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit faire entre 3 et 100 caractères'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('budget')
    .isFloat({ min: 0 })
    .withMessage('Le budget doit être un nombre positif'),
  body('startDate')
    .isISO8601()
    .withMessage('La date de début est invalide')
    .custom(value => {
      const date = new Date(value);
      if (date < new Date()) {
        throw new Error('La date de début ne peut pas être dans le passé');
      }
      return true;
    }),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('La date de fin est invalide')
    .custom((value, { req }) => {
      if (value && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('La date de fin doit être après la date de début');
      }
      return true;
    }),
  body('managerId')
    .isUUID()
    .withMessage('L\'ID du manager doit être un UUID valide')
];

const createEmployeeValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit faire entre 2 et 50 caractères'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit faire entre 2 et 50 caractères'),
  validateEmail(),
  body('phone')
    .optional()
    .matches(/^[0-9+\s-]{10,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('position')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le poste doit faire entre 3 et 100 caractères'),
  body('hireDate')
    .isISO8601()
    .withMessage('La date d\'embauche est invalide')
];

const loginValidation = [
  validateEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];

const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit faire entre 2 et 50 caractères'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit faire entre 2 et 50 caractères'),
  validateEmail(),
  validatePassword(),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MANAGER', 'SITE_MANAGER', 'USER'])
    .withMessage('Rôle invalide')
];

//  Une seule déclaration
const createMaterialValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit faire entre 3 et 100 caractères'),
  body('reference')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La référence doit faire entre 2 et 50 caractères'),
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('La quantité doit être un nombre positif'),
  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Le prix unitaire doit être un nombre positif'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La catégorie doit faire entre 2 et 50 caractères'),
  body('minQuantity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La quantité minimale doit être un nombre positif'),
  body('unit')
    .optional()
    .isIn(['UNIT', 'KG', 'TON', 'M', 'M2', 'M3', 'L', 'HOUR', 'DAY'])
    .withMessage('Unité invalide')
];

//  Une seule déclaration
const createInvoiceValidation = [
  body('clientId')
    .isUUID()
    .withMessage('L\'ID du client doit être un UUID valide'),
  body('projectId')
    .optional()
    .isUUID()
    .withMessage('L\'ID du projet doit être un UUID valide'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Le montant doit être un nombre positif'),
  body('issueDate')
    .isISO8601()
    .withMessage('La date d\'émission est invalide'),
  body('dueDate')
    .isISO8601()
    .withMessage('La date d\'échéance est invalide')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.issueDate)) {
        throw new Error('La date d\'échéance doit être après la date d\'émission');
      }
      return true;
    }),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères')
];

const createPaymentValidation = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Le montant doit être un nombre positif'),
  body('paymentDate')
    .isISO8601()
    .withMessage('La date de paiement est invalide'),
  body('paymentMethod')
    .optional()
    .isIn(['CASH', 'CHECK', 'BANK_TRANSFER', 'CREDIT_CARD'])
    .withMessage('Méthode de paiement invalide'),
  body('reference')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La référence ne peut pas dépasser 50 caractères')
];

module.exports = {
  validateId,
  validateEmail,
  validatePassword,
  createProjectValidation,
  createEmployeeValidation,
  loginValidation,
  registerValidation,
  createMaterialValidation,
  createInvoiceValidation,
  createPaymentValidation
};