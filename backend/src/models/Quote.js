const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Quote = sequelize.define('Quote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    quoteNumber: {
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
    status: {
      type: DataTypes.ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'),
      defaultValue: 'DRAFT'
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
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
    tableName: 'quotes'
  });

  Quote.associate = (models) => {
    Quote.belongsTo(models.Client, {
      as: 'client',
      foreignKey: 'clientId'
    });
    Quote.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId'
    });
    Quote.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy'
    });
  };

  return Quote;
};