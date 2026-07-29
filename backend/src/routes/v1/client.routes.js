const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/client.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/', checkRole([ROLES.ADMIN, ROLES.MANAGER]), clientController.create);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.MANAGER]), clientController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), clientController.delete);

module.exports = router;