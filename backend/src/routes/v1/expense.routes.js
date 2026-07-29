const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/expense.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.post('/', checkRole([ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]), expenseController.create);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.MANAGER]), expenseController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), expenseController.delete);

module.exports = router;