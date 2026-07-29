const materialService = require('../services/material.service');
const logger = require('../middleware/logger');

class MaterialController {
  // Créer un matériel
  async create(req, res, next) {
    try {
      const material = await materialService.createMaterial(req.body);

      res.status(201).json({
        success: true,
        message: 'Matériel créé avec succès',
        data: material
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir tous les matériels
  async getAll(req, res, next) {
    try {
      const { page, limit, search, category, isAvailable } = req.query;
      const result = await materialService.getAllMaterials({
        page,
        limit,
        search,
        category,
        isAvailable
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir un matériel par ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const material = await materialService.getMaterialById(id);

      res.status(200).json({
        success: true,
        data: material
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un matériel
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const material = await materialService.updateMaterial(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Matériel mis à jour avec succès',
        data: material
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour la quantité
  async updateQuantity(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body;
      
      const material = await materialService.updateQuantity(id, quantity, operation);

      res.status(200).json({
        success: true,
        message: 'Quantité mise à jour avec succès',
        data: material
      });
    } catch (error) {
      next(error);
    }
  }

  // Affecter à un projet
  async assignToProject(req, res, next) {
    try {
      const { id } = req.params;
      const { projectId, quantity } = req.body;
      
      const result = await materialService.assignToProject(id, projectId, quantity);

      res.status(200).json({
        success: true,
        message: 'Matériel affecté au projet avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les matériels par projet
  async getByProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const materials = await materialService.getMaterialsByProject(projectId);

      res.status(200).json({
        success: true,
        data: materials
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les alertes de stock
  async getStockAlerts(req, res, next) {
    try {
      const alerts = await materialService.getStockAlerts();

      res.status(200).json({
        success: true,
        data: alerts
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques
  async getStats(req, res, next) {
    try {
      const stats = await materialService.getMaterialStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un matériel
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await materialService.deleteMaterial(id);

      res.status(200).json({
        success: true,
        message: 'Matériel supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MaterialController();