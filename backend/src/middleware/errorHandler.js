const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  // Log de l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Erreur Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Cette ressource existe déjà',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Cette ressource est liée à d\'autres entités'
    });
  }

  // Erreur personnalisée
  if (err.isCustom) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Erreur interne du serveur' : err.message;

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;