const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authConfig = require('../config/auth');
const logger = require('../middleware/logger');

class AuthService {
  // Inscription
  async register(userData) {
    try {
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        const error = new Error('Cet email est déjà utilisé');
        error.isCustom = true;
        error.statusCode = 409;
        throw error;
      }

      const user = await User.create(userData);
      const token = this.generateToken(user);
      
      return { user, token };
    } catch (error) {
      logger.error(`Erreur inscription: ${error.message}`);
      throw error;
    }
  }

  // Connexion
  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        const error = new Error('Email ou mot de passe incorrect');
        error.isCustom = true;
        error.statusCode = 401;
        throw error;
      }

      if (!user.isActive) {
        const error = new Error('Ce compte est désactivé');
        error.isCustom = true;
        error.statusCode = 403;
        throw error;
      }

      const isValidPassword = await user.comparePassword(password);
      
      if (!isValidPassword) {
        const error = new Error('Email ou mot de passe incorrect');
        error.isCustom = true;
        error.statusCode = 401;
        throw error;
      }

      await user.update({ lastLogin: new Date() });
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      logger.error(`Erreur connexion: ${error.message}`);
      throw error;
    }
  }

  // Générer le token JWT
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn
    });
  }

  // Rafraîchir le token
  refreshToken(user) {
    return this.generateToken(user);
  }

  // Vérifier le token
  verifyToken(token) {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (error) {
      logger.error(`Erreur vérification token: ${error.message}`);
      throw error;
    }
  }

  // Changement de mot de passe
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      const isValidPassword = await user.comparePassword(oldPassword);
      
      if (!isValidPassword) {
        const error = new Error('Ancien mot de passe incorrect');
        error.isCustom = true;
        error.statusCode = 401;
        throw error;
      }

      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      logger.error(`Erreur changement mot de passe: ${error.message}`);
      throw error;
    }
  }

  // ✅ Récupérer un utilisateur par ID (AJOUTÉ)
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
      });
      
      if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }
      
      return user;
    } catch (error) {
      logger.error(`Erreur récupération utilisateur: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();