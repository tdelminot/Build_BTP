const { DataTypes } = require('sequelize');
const { TASK_STATUS, PRIORITIES } = require('../utils/constants');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(TASK_STATUS)),
      defaultValue: TASK_STATUS.TODO
    },
    priority: {
      type: DataTypes.ENUM(Object.values(PRIORITIES)),
      defaultValue: PRIORITIES.MEDIUM
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    actualHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'tasks'
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId'
    });
    Task.belongsTo(models.Employee, {
      as: 'assignedEmployee',
      foreignKey: 'assignedTo'
    });
    Task.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy'
    });
  };

  return Task;
};