const projectService = require('../services/project.service');
const logger = require('../middleware/logger');

class ProjectController {
  // Créer un projet
  async create(req, res, next) {
    try {
      const projectData = {
        ...req.body,
        managerId: req.body.managerId || req.user.id
      };
      
      const project = await projectService.createProject(projectData);

      res.status(201).json({
        success: true,
        message: 'Projet créé avec succès',
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir tous les projets
  async getAll(req, res, next) {
    try {
      const { page, limit, status, search } = req.query;
      const result = await projectService.getAllProjects({ 
        page, 
        limit, 
        status, 
        search 
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir un projet par ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);

      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un projet
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const project = await projectService.updateProject(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Projet mis à jour avec succès',
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour la progression
  async updateProgress(req, res, next) {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      const project = await projectService.updateProgress(id, progress);

      res.status(200).json({
        success: true,
        message: 'Progression mise à jour',
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les projets actifs
  async getActiveProjects(req, res, next) {
    try {
      const projects = await projectService.getActiveProjects();

      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques
  async getStats(req, res, next) {
    try {
      const stats = await projectService.getProjectStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Supprimer un projet
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await projectService.deleteProject(id);

      res.status(200).json({
        success: true,
        message: 'Projet supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();