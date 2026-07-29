const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/project.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { validateRequest } = require('../../middleware/validation/validateRequest');
const { createProjectValidation } = require('../../utils/validators');
const { ROLES } = require('../../utils/constants');

// Routes protégées
router.use(jwtAuth);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', projectController.getAll);
router.get('/active', projectController.getActiveProjects);
router.get('/stats', projectController.getStats);
router.get('/:id', projectController.getById);

// Routes accessibles uniquement aux managers et admins
router.post(
  '/',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  createProjectValidation,
  validateRequest,
  projectController.create
);

router.put(
  '/:id',
  checkRole([ROLES.ADMIN, ROLES.MANAGER]),
  projectController.update
);

router.patch(
  '/:id/progress',
  checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]),
  projectController.updateProgress
);

router.delete(
  '/:id',
  checkRole([ROLES.ADMIN]),
  projectController.delete
);

module.exports = router;