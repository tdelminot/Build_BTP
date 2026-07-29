const { DataTypes } = require('sequelize');
const { INVOICE_STATUS } = require('../utils/constants');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM(Object.values(INVOICE_STATUS)),
      defaultValue: INVOICE_STATUS.DRAFT
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'invoices'
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Client, {
      as: 'client',
      foreignKey: 'clientId'
    });
    Invoice.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId'
    });
    Invoice.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy'
    });
    Invoice.hasMany(models.Payment, {
      as: 'payments',
      foreignKey: 'invoiceId'
    });
  };

  return Invoice;
};