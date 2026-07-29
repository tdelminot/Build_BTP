const { DataTypes } = require('sequelize');
const { UNITS } = require('../utils/constants');

module.exports = (sequelize) => {
  const Material = sequelize.define('Material', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    reference: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    unit: {
      type: DataTypes.ENUM(Object.values(UNITS)),
      defaultValue: UNITS.UNIT
    },
    quantity: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    minQuantity: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'materials'
  });

  Material.associate = (models) => {
    Material.belongsTo(models.Supplier, {
      as: 'supplier',
      foreignKey: 'supplierId'
    });
    Material.belongsToMany(models.Project, {
      through: 'ProjectMaterials',
      as: 'projects',
      foreignKey: 'materialId',
      otherKey: 'projectId',
      timestamps: true
    });
    Material.hasMany(models.MaterialMovement, {
      as: 'movements',
      foreignKey: 'materialId'
    });
  };

  return Material;
};