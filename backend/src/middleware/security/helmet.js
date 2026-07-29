const helmet = require('helmet');
const securityConfig = require('../../config/security');

module.exports = (app) => {
  app.use(helmet(securityConfig.helmet));
};