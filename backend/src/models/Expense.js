const { DataTypes } = require('sequelize');
const { EXPENSE_TYPES } = require('../utils/constants');

module.exports = (sequelize) => {
  const Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    type: {
      type: DataTypes.ENUM(Object.values(EXPENSE_TYPES)),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    receiptUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'expenses'
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId'
    });
    Expense.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    Expense.belongsTo(models.User, {
      as: 'approver',
      foreignKey: 'approvedBy'
    });
  };

  return Expense;
};