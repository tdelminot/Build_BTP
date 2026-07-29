// backend/src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');  
const basename = path.basename(__filename);

// Charger dotenv APRÈS les imports
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

//  LOGS DE DEBUG (après dotenv)
console.log('🔍 Environment:', env);
console.log('🔍 DB_NAME:', process.env.DB_NAME);
console.log('🔍 DB_USER:', process.env.DB_USER);
console.log('🔍 DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET');

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging || false,
      pool: config.pool || {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: config.define || {
        timestamps: true,
        underscored: true,
        underscoredAll: true
      }
    }
  );
}

// Charger tous les modèles
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Exécuter les associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;