const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectMaterial = sequelize.define('ProjectMaterial', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    materialId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'project_materials',
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'material_id']  //  snake_case
      }
    ]
  });

  ProjectMaterial.associate = (models) => {
    ProjectMaterial.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId'
    });
    ProjectMaterial.belongsTo(models.Material, {
      as: 'material',
      foreignKey: 'materialId'
    });
  };

  return ProjectMaterial;
};