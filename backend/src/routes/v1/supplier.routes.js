const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplier.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', checkRole([ROLES.ADMIN, ROLES.MANAGER]), supplierController.create);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.MANAGER]), supplierController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), supplierController.delete);

module.exports = router;