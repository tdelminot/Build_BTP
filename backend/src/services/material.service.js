const { Material, Supplier, Project, ProjectMaterial, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../middleware/logger');
const { generateReference } = require('../utils/helpers');

class MaterialService {
  // Créer un matériel
  async createMaterial(materialData) {
    try {
      // Générer une référence unique
      materialData.reference = generateReference('MAT', 6);

      const material = await Material.create(materialData);
      
      logger.info(`Matériel créé: ${material.name} (${material.id})`);
      return material;
    } catch (error) {
      logger.error(`Erreur création matériel: ${error.message}`);
      throw error;
    }
  }

  // Obtenir tous les matériels
  async getAllMaterials({ page = 1, limit = 10, search = '', category = '', isAvailable = null }) {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { reference: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category) {
        where.category = category;
      }

      if (isAvailable !== null) {
        where.isAvailable = isAvailable === 'true';
      }

      const { count, rows } = await Material.findAndCountAll({
        where,
        include: [
          { model: Supplier, as: 'supplier', attributes: ['id', 'name'] }
        ],
        order: [['name', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        materials: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error(`Erreur récupération matériels: ${error.message}`);
      throw error;
    }
  }

  // Obtenir un matériel par ID
  async getMaterialById(materialId) {
    try {
      const material = await Material.findByPk(materialId, {
        include: [
          { model: Supplier, as: 'supplier' },
          { 
            model: Project, 
            as: 'projects',
            through: { attributes: ['quantity'] },
            attributes: ['id', 'name', 'status']
          }
        ]
      });

      if (!material) {
        const error = new Error('Matériel non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      return material;
    } catch (error) {
      logger.error(`Erreur récupération matériel ${materialId}: ${error.message}`);
      throw error;
    }
  }

  // Mettre à jour un matériel
  async updateMaterial(materialId, updateData) {
    try {
      const material = await Material.findByPk(materialId);
      
      if (!material) {
        const error = new Error('Matériel non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await material.update(updateData);
      
      logger.info(`Matériel mis à jour: ${material.name}`);
      return material;
    } catch (error) {
      logger.error(`Erreur mise à jour matériel ${materialId}: ${error.message}`);
      throw error;
    }
  }

  // Mettre à jour la quantité
  async updateQuantity(materialId, quantity, operation = 'add') {
    try {
      const material = await Material.findByPk(materialId);
      
      if (!material) {
        const error = new Error('Matériel non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      let newQuantity = material.quantity;
      
      if (operation === 'add') {
        newQuantity = parseFloat(material.quantity) + parseFloat(quantity);
      } else if (operation === 'subtract') {
        newQuantity = parseFloat(material.quantity) - parseFloat(quantity);
        if (newQuantity < 0) {
          const error = new Error('Quantité insuffisante en stock');
          error.isCustom = true;
          error.statusCode = 400;
          throw error;
        }
      } else {
        newQuantity = parseFloat(quantity);
      }

      await material.update({ quantity: newQuantity });

      // Vérifier les alertes de stock
      if (newQuantity <= material.minQuantity) {
        logger.warn(`Alerte stock bas: ${material.name} - Quantité: ${newQuantity}`);
      }

      logger.info(`Quantité mise à jour pour ${material.name}: ${newQuantity}`);
      return material;
    } catch (error) {
      logger.error(`Erreur mise à jour quantité ${materialId}: ${error.message}`);
      throw error;
    }
  }

  // Affecter à un projet
  async assignToProject(materialId, projectId, quantity) {
    try {
      const material = await Material.findByPk(materialId);
      if (!material) {
        const error = new Error('Matériel non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier le stock
      if (parseFloat(material.quantity) < parseFloat(quantity)) {
        const error = new Error('Stock insuffisant');
        error.isCustom = true;
        error.statusCode = 400;
        throw error;
      }

      // Créer l'affectation
      const [assignment, created] = await ProjectMaterial.findOrCreate({
        where: {
          materialId,
          projectId
        },
        defaults: {
          quantity: quantity
        }
      });

      if (!created) {
        // Mettre à jour la quantité si déjà affecté
        const newQuantity = parseFloat(assignment.quantity) + parseFloat(quantity);
        await assignment.update({ quantity: newQuantity });
      }

      // Mettre à jour le stock
      await this.updateQuantity(materialId, quantity, 'subtract');

      logger.info(`Matériel ${material.name} affecté au projet ${projectId} (${quantity} unités)`);
      return assignment;
    } catch (error) {
      logger.error(`Erreur affectation matériel ${materialId}: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les matériels par projet
  async getMaterialsByProject(projectId) {
    try {
      const materials = await ProjectMaterial.findAll({
        where: { projectId },
        include: [
          { model: Material, as: 'material' }
        ]
      });

      return materials;
    } catch (error) {
      logger.error(`Erreur récupération matériels du projet ${projectId}: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les alertes de stock
  async getStockAlerts() {
    try {
      const alerts = await Material.findAll({
        where: {
          [Op.and]: [
            { isAvailable: true },
            sequelize.where(
              sequelize.col('quantity'),
              '<=',
              sequelize.col('minQuantity')
            )
          ]
        },
        attributes: ['id', 'name', 'reference', 'quantity', 'minQuantity'],
        order: [['quantity', 'ASC']]
      });

      return alerts;
    } catch (error) {
      logger.error(`Erreur récupération alertes stock: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les statistiques
  async getMaterialStats() {
    try {
      const total = await Material.count();
      const totalValue = await Material.sum(
        sequelize.literal('quantity * unit_price')
      );

      const categories = await Material.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('category')), 'count']
        ],
        group: ['category']
      });

      return {
        totalItems: total,
        totalValue: parseFloat(totalValue || 0),
        categories: categories.map(c => ({
          name: c.category,
          count: parseInt(c.get('count'))
        })),
        lowStock: (await this.getStockAlerts()).length
      };
    } catch (error) {
      logger.error(`Erreur récupération stats matériels: ${error.message}`);
      throw error;
    }
  }

  // Supprimer un matériel
  async deleteMaterial(materialId) {
    try {
      const material = await Material.findByPk(materialId);
      
      if (!material) {
        const error = new Error('Matériel non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await material.destroy();
      
      logger.info(`Matériel supprimé: ${material.name}`);
      return true;
    } catch (error) {
      logger.error(`Erreur suppression matériel ${materialId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new MaterialService();