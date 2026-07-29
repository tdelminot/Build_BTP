const { DataTypes } = require('sequelize');
const { PROJECT_STATUS } = require('../utils/constants');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reference: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(PROJECT_STATUS)),
      defaultValue: PROJECT_STATUS.PLANNING
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    actualCost: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'projects'
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      as: 'manager',
      foreignKey: 'managerId'
    });
    Project.belongsTo(models.Client, {
      as: 'client',
      foreignKey: 'clientId'
    });
    Project.hasMany(models.Task, {
      as: 'tasks',
      foreignKey: 'projectId'
    });
    Project.hasMany(models.Expense, {
      as: 'expenses',
      foreignKey: 'projectId'
    });
    Project.hasMany(models.Invoice, {
      as: 'invoices',
      foreignKey: 'projectId'
    });
    Project.belongsToMany(models.Employee, {
      through: 'ProjectEmployees',
      as: 'employees',
      foreignKey: 'projectId',
      otherKey: 'employeeId',
      timestamps: true
    });
    Project.belongsToMany(models.Material, {
      through: 'ProjectMaterials',
      as: 'materials',
      foreignKey: 'projectId',
      otherKey: 'materialId',
      timestamps: true
    });
  };

  return Project;
};