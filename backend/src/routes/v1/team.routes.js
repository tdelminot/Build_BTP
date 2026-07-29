const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/team.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);
router.post('/', checkRole([ROLES.ADMIN, ROLES.MANAGER]), teamController.create);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.MANAGER]), teamController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), teamController.delete);

module.exports = router;