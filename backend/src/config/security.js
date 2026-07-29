require('dotenv').config();

module.exports = {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: 'Trop de requêtes, veuillez réessayer dans 15 minutes.'
  },
  recaptcha: {
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
    verifyUrl: 'https://www.google.com/recaptcha/api/siteverify'
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL]
      }
    }
  }
};