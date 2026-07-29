require('dotenv').config();
const express = require('express');
const compression = require('compression');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const helmetMiddleware = require('./middleware/security/helmet');
const corsMiddleware = require('./middleware/security/cors');
const rateLimitMiddleware = require('./middleware/security/rateLimit');
const xssMiddleware = require('./middleware/security/xssProtection');

const app = express();

//  CORS en PREMIER
corsMiddleware(app);

//  Sécurité
helmetMiddleware(app);
rateLimitMiddleware(app);
xssMiddleware(app);

//  Middlewares généraux
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//  Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

//  Routes
app.use('/api', routes);

//  Erreurs
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

app.use(errorHandler);

module.exports = app;