const axios = require('axios');
const securityConfig = require('../../config/security');

const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post(
      securityConfig.recaptcha.verifyUrl,
      null,
      {
        params: {
          secret: securityConfig.recaptcha.secretKey,
          response: token
        }
      }
    );
    return response.data.success;
  } catch (error) {
    console.error('Erreur reCAPTCHA:', error);
    return false;
  }
};

const recaptchaMiddleware = async (req, res, next) => {
  // Ne pas vérifier en développement
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const token = req.body.recaptchaToken || req.headers['x-recaptcha-token'];
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token reCAPTCHA manquant'
    });
  }

  const isValid = await verifyRecaptcha(token);
  
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation reCAPTCHA échouée'
    });
  }

  next();
};

module.exports = recaptchaMiddleware;