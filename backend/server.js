const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./src/app');
const { sequelize } = require('./src/models');
const logger = require('./src/middleware/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connexion à la base de données MySQL établie avec succès.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Modèles synchronisés avec la base de données.');
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`🌐 Environnement: ${process.env.NODE_ENV}`);
      logger.info(`📡 API: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => { logger.info('SIGTERM reçu'); process.exit(0); });
process.on('SIGINT', () => { logger.info('SIGINT reçu'); process.exit(0); });

startServer();