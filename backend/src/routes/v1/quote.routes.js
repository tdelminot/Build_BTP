const express = require('express');
const router = express.Router();
const quoteController = require('../../controllers/quote.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

router.use(jwtAuth);

router.get('/', quoteController.getAll);
router.get('/:id', quoteController.getById);
router.post('/', checkRole([ROLES.ADMIN, ROLES.MANAGER]), quoteController.create);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.MANAGER]), quoteController.update);
router.delete('/:id', checkRole([ROLES.ADMIN]), quoteController.delete);

module.exports = router;