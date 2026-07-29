const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MaterialMovement = sequelize.define('MaterialMovement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    materialId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    previousQuantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    newQuantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'material_movements'
  });

  MaterialMovement.associate = (models) => {
    MaterialMovement.belongsTo(models.Material, {
      as: 'material',
      foreignKey: 'materialId'
    });
    MaterialMovement.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
    MaterialMovement.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId'
    });
  };

  return MaterialMovement;
};