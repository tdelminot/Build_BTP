const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');
const recaptchaMiddleware = require('../../middleware/security/recaptcha');
const { validateRequest } = require('../../middleware/validation/validateRequest');
const { 
  loginValidation, 
  registerValidation 
} = require('../../utils/validators');

// Routes publiques
router.post(
  '/register',
  registerValidation,
  validateRequest,
  recaptchaMiddleware,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  validateRequest,
  recaptchaMiddleware,
  authController.login
);

// Routes protégées
router.get('/profile', jwtAuth, authController.getProfile);
router.post('/refresh-token', jwtAuth, authController.refreshToken);
router.post('/change-password', jwtAuth, authController.changePassword);

module.exports = router;