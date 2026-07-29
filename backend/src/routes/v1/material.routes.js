const express = require('express');
const router = express.Router();
const materialController = require('../../controllers/material.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { validateRequest } = require('../../middleware/validation/validateRequest');
const { createMaterialValidation } = require('../../utils/validators');
const { ROLES } = require('../../utils/constants');

// Routes protégées
router.use(jwtAuth);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', materialController.getAll);
router.get('/alerts', materialController.getStockAlerts);
router.get('/stats', materialController.getStats);
router.get('/project/:projectId', materialController.getByProject);
router.get('/:id', materialController.getById);

// Routes réservées à l'admin et aux managers
router.post(
  '/',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  createMaterialValidation,
  validateRequest,
  materialController.create
);

router.put(
  '/:id',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  materialController.update
);

router.patch(
  '/:id/quantity',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  materialController.updateQuantity
);

router.post(
  '/:id/assign',
  checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]),
  materialController.assignToProject
);

router.delete(
  '/:id',
  checkRole([ROLES.ADMIN]),
  materialController.delete
);

module.exports = router;