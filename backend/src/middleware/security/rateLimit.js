const rateLimit = require('express-rate-limit');
const securityConfig = require('../../config/security');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 99999 : 100,
  message: 'Trop de requêtes, veuillez réessayer dans 15 minutes.',
  skip: (req) => process.env.NODE_ENV === 'development'
});

module.exports = (app) => {
  // Appliquer sur toutes les routes API
  app.use('/api', limiter);
  
  // Limiteur plus strict pour l'authentification
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 99999 : 5,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
    skip: (req) => process.env.NODE_ENV === 'development'
  });
  
  app.use('/api/v1/auth/login', authLimiter);
  app.use('/api/v1/auth/register', authLimiter);
};