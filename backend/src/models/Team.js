const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Team = sequelize.define('Team', {
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
    leaderId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'teams'
  });

  Team.associate = (models) => {
    Team.belongsTo(models.Employee, {
      as: 'leader',
      foreignKey: 'leaderId'
    });
    Team.hasMany(models.Employee, {
      as: 'members',
      foreignKey: 'teamId'
    });
  };

  return Team;
};