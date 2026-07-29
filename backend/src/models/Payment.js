const { DataTypes } = require('sequelize');
const { PAYMENT_METHODS } = require('../utils/constants');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    paymentMethod: {
      type: DataTypes.ENUM(Object.values(PAYMENT_METHODS)),
      defaultValue: PAYMENT_METHODS.BANK_TRANSFER
    },
    reference: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'payments'
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Invoice, {
      as: 'invoice',
      foreignKey: 'invoiceId'
    });
    Payment.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  };

  return Payment;
};