const cors = require('cors');

const corsOptions = {
  origin: [
    'https://build-btp.vercel.app',      //  Frontend Vercel
    'https://build-btp-git-main-tdelminot1vercelapp.vercel.app',  //  Preview Vercel
    'http://localhost:3000'               //  Développement local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400
};

const corsMiddleware = (app) => {
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
};

module.exports = corsMiddleware;