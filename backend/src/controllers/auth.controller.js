const authService = require('../services/auth.service');
const logger = require('../middleware/logger');

class AuthController {
  // Inscription
  async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Connexion
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Rafraîchir le token
  async refreshToken(req, res, next) {
    try {
      const { user } = req;
      const token = authService.refreshToken(user);

      res.status(200).json({
        success: true,
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }

  // Profil utilisateur
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Changement de mot de passe
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      
      await authService.changePassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Mot de passe changé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();