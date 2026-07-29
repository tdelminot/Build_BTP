const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/invoice.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { validateRequest } = require('../../middleware/validation/validateRequest');
const { createInvoiceValidation } = require('../../utils/validators');
const { ROLES } = require('../../utils/constants');

// Routes protégées
router.use(jwtAuth);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', invoiceController.getAll);
router.get('/overdue', invoiceController.getOverdue);
router.get('/stats', invoiceController.getStats);
router.get('/:id', invoiceController.getById);

// Routes réservées à l'admin et aux managers
router.post(
  '/',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  createInvoiceValidation,
  validateRequest,
  invoiceController.create
);

router.put(
  '/:id',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  invoiceController.update
);

router.patch(
  '/:id/send',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  invoiceController.sendInvoice
);

router.post(
  '/:id/payment',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  invoiceController.recordPayment
);

router.delete(
  '/:id',
  checkRole([ROLES.ADMIN]),
  invoiceController.delete
);

module.exports = router;