const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', checkRole([ROLES.ADMIN]), userController.getAll);
router.get('/:id', checkRole([ROLES.ADMIN]), userController.getById);
router.post('/', checkRole([ROLES.ADMIN]), userController.create);
router.put('/:id', checkRole([ROLES.ADMIN]), userController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), userController.delete);

module.exports = router;