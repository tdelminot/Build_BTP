const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employee.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { validateRequest } = require('../../middleware/validation/validateRequest');
const { createEmployeeValidation } = require('../../utils/validators');
const { ROLES } = require('../../utils/constants');

// Routes protégées
router.use(jwtAuth);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', employeeController.getAll);
router.get('/stats', employeeController.getStats);
router.get('/:id', employeeController.getById);

// Routes réservées à l'admin et aux managers
router.post(
  '/',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  createEmployeeValidation,
  validateRequest,
  employeeController.create
);

router.put(
  '/:id',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  employeeController.update
);

router.patch(
  '/:id/team',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  employeeController.assignToTeam
);

// Routes de présence (accessibles aux managers et chefs de chantier)
router.post(
  '/attendance',
  checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]),
  employeeController.recordAttendance
);

router.get(
  '/:id/attendance',
  checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]),
  employeeController.getAttendance
);

module.exports = router;