const { Project, User, Employee, Expense, Task, Client, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../middleware/logger');
const { generateReference } = require('../utils/helpers');
const { PROJECT_STATUS } = require('../utils/constants');

class ProjectService {
  // Créer un projet
  async createProject(projectData) {
    try {
      // Générer une référence unique
      projectData.reference = generateReference('PROJ', 6);

      const project = await Project.create(projectData);
      
      logger.info(`Projet créé: ${project.name} (${project.id})`);
      return project;
    } catch (error) {
      logger.error(`Erreur création projet: ${error.message}`);
      throw error;
    }
  }

  // Obtenir tous les projets avec pagination
  async getAllProjects({ page = 1, limit = 10, status = null, search = '' }) {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (status) {
        where.status = status;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { reference: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Project.findAndCountAll({
        where,
        include: [
          { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Client, as: 'client', attributes: ['id', 'name'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        projects: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error(`Erreur récupération projets: ${error.message}`);
      throw error;
    }
  }

  // Obtenir un projet par ID avec tous les détails
  async getProjectById(projectId) {
    try {
      const project = await Project.findByPk(projectId, {
        include: [
          { 
            model: User, 
            as: 'manager', 
            attributes: ['id', 'firstName', 'lastName', 'email'] 
          },
          { 
            model: Client, 
            as: 'client', 
            attributes: ['id', 'name', 'email', 'phone'] 
          },
          { 
            model: Employee, 
            as: 'employees',
            through: { attributes: [] },
            attributes: ['id', 'firstName', 'lastName', 'position']
          },
          { 
            model: Task, 
            as: 'tasks',
            attributes: ['id', 'title', 'status', 'priority', 'dueDate']
          },
          { 
            model: Expense, 
            as: 'expenses',
            attributes: ['id', 'description', 'amount', 'date', 'type']
          }
        ]
      });

      if (!project) {
        const error = new Error('Projet non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Calculer les statistiques financières
      const totalExpenses = project.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const budget = parseFloat(project.budget);
      const margin = budget - totalExpenses;
      const marginPercentage = budget > 0 ? (margin / budget) * 100 : 0;

      // Compter les tâches par statut
      const tasksStats = {
        total: project.tasks.length,
        todo: project.tasks.filter(t => t.status === 'TODO').length,
        inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: project.tasks.filter(t => t.status === 'COMPLETED').length,
        blocked: project.tasks.filter(t => t.status === 'BLOCKED').length
      };

      return {
        ...project.toJSON(),
        financial: {
          budget,
          totalExpenses,
          margin,
          marginPercentage: Math.round(marginPercentage * 100) / 100
        },
        tasksStats
      };
    } catch (error) {
      logger.error(`Erreur récupération projet ${projectId}: ${error.message}`);
      throw error;
    }
  }

  // Mettre à jour un projet
  async updateProject(projectId, updateData) {
    try {
      const project = await Project.findByPk(projectId);
      
      if (!project) {
        const error = new Error('Projet non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await project.update(updateData);
      
      logger.info(`Projet mis à jour: ${project.name} (${project.id})`);
      return project;
    } catch (error) {
      logger.error(`Erreur mise à jour projet ${projectId}: ${error.message}`);
      throw error;
    }
  }

  // Mettre à jour la progression
  async updateProgress(projectId, progress) {
    try {
      const project = await Project.findByPk(projectId);
      
      if (!project) {
        const error = new Error('Projet non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await project.update({ progress });

      // Si le projet est à 100%, le marquer comme terminé
      if (progress === 100 && project.status !== PROJECT_STATUS.COMPLETED) {
        await project.update({ 
          status: PROJECT_STATUS.COMPLETED,
          endDate: new Date()
        });
      }

      logger.info(`Progression mise à jour pour ${project.name}: ${progress}%`);
      return project;
    } catch (error) {
      logger.error(`Erreur mise à jour progression ${projectId}: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les projets actifs (pour le dashboard)
  async getActiveProjects() {
    try {
      const projects = await Project.findAll({
        where: {
          status: {
            [Op.in]: [PROJECT_STATUS.PLANNING, PROJECT_STATUS.IN_PROGRESS]
          }
        },
        include: [
          { model: User, as: 'manager', attributes: ['id', 'firstName', 'lastName'] }
        ],
        order: [['startDate', 'ASC']],
        limit: 10
      });

      return projects;
    } catch (error) {
      logger.error(`Erreur récupération projets actifs: ${error.message}`);
      throw error;
    }
  }

  // Supprimer un projet
  async deleteProject(projectId) {
    try {
      const project = await Project.findByPk(projectId);
      
      if (!project) {
        const error = new Error('Projet non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await project.destroy();
      
      logger.info(`Projet supprimé: ${project.name} (${project.id})`);
      return true;
    } catch (error) {
      logger.error(`Erreur suppression projet ${projectId}: ${error.message}`);
      throw error;
    }
  }

  // Statistiques globales des projets
  async getProjectStats() {
    try {
      const total = await Project.count();
      const byStatus = await Project.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      const totalBudget = await Project.sum('budget');
      const totalCost = await Project.sum('actualCost');

      return {
        total,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.get('count'));
          return acc;
        }, {}),
        totalBudget: parseFloat(totalBudget || 0),
        totalCost: parseFloat(totalCost || 0),
        averageProgress: await Project.findOne({
          attributes: [
            [sequelize.fn('AVG', sequelize.col('progress')), 'avgProgress']
          ]
        }).then(result => Math.round(result.get('avgProgress') || 0))
      };
    } catch (error) {
      logger.error(`Erreur récupération stats projets: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ProjectService();