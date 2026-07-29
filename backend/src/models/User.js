const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MANAGER', 'SITE_MANAGER', 'USER'),
      defaultValue: 'USER'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(parseInt(authConfig.bcrypt.saltRounds));
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(parseInt(authConfig.bcrypt.saltRounds));
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Méthode pour comparer les mots de passe
  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  // Méthode pour retourner les données sans le mot de passe
  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.passwordResetToken;
    delete values.passwordResetExpires;
    return values;
  };

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Project, {
      as: 'managedProjects',
      foreignKey: 'managerId'
    });
    User.hasMany(models.Task, {
      as: 'assignedTasks',
      foreignKey: 'assignedTo'
    });
  };

  return User;
};