const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkInTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    checkOutTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'HOLIDAY'),
      defaultValue: 'PRESENT'
    },
    overtimeHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'attendances',
    indexes: [
      {
        unique: true,
        fields: ['employee_id', 'date']  // ←snake_case
      }
    ]
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Employee, {
      as: 'employee',
      foreignKey: 'employeeId',
      constraints: false  // ← Ajout
    });
    Attendance.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
      constraints: false  // ← AJOUT
    });
  };

  return Attendance;
};