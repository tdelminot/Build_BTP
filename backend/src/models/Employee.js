const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9+\s-]{10,15}$/
      }
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    hireDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emergencyContact: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    emergencyPhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'employees'
  });

  Employee.associate = (models) => {
    Employee.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'teamId',
      constraints: false  // ← AJOUT
    });
    Employee.hasMany(models.Task, {
      as: 'assignedTasks',
      foreignKey: 'assignedTo',
      constraints: false  // ← AJOUT
    });
    Employee.belongsToMany(models.Project, {
      through: 'ProjectEmployees',
      as: 'projects',
      foreignKey: 'employeeId',
      otherKey: 'projectId',
      timestamps: true,
      constraints: false  // ← AJOUT
    });
    Employee.hasMany(models.Attendance, {
      as: 'attendances',
      foreignKey: 'employeeId',
      constraints: false  // ← AJOUT
    });
  };

  return Employee;
};