const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]), taskController.create);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]), taskController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), taskController.delete);

module.exports = router;