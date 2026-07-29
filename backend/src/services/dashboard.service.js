const { Project, Employee, Invoice, Expense, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../middleware/logger');
const { PROJECT_STATUS, INVOICE_STATUS } = require('../utils/constants');

class DashboardService {
  // Données principales du dashboard
  async getDashboardData() {
    try {
      const [
        projectStats,
        employeeStats,
        financialStats,
        recentProjects,
        recentActivities
      ] = await Promise.all([
        this.getProjectStats(),
        this.getEmployeeStats(),
        this.getFinancialStats(),
        this.getRecentProjects(),
        this.getRecentActivities()
      ]);

      return {
        projects: projectStats,
        employees: employeeStats,
        financial: financialStats,
        recentProjects,
        recentActivities
      };
    } catch (error) {
      logger.error(`Erreur récupération dashboard: ${error.message}`);
      throw error;
    }
  }

  // Statistiques des projets
  async getProjectStats() {
    try {
      const total = await Project.count();
      const inProgress = await Project.count({ 
        where: { status: PROJECT_STATUS.IN_PROGRESS } 
      });
      const completed = await Project.count({ 
        where: { status: PROJECT_STATUS.COMPLETED } 
      });
      const planning = await Project.count({ 
        where: { status: PROJECT_STATUS.PLANNING } 
      });
      const onHold = await Project.count({ 
        where: { status: PROJECT_STATUS.ON_HOLD } 
      });

      const totalBudget = await Project.sum('budget');
      const totalCost = await Project.sum('actualCost');

      // Utiliser sequelize correctement
      const avgProgress = await Project.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('progress')), 'avgProgress']
        ]
      });

      return {
        total,
        inProgress,
        completed,
        planning,
        onHold,
        totalBudget: parseFloat(totalBudget || 0),
        totalCost: parseFloat(totalCost || 0),
        averageProgress: Math.round(avgProgress?.get('avgProgress') || 0)
      };
    } catch (error) {
      logger.error(`Erreur stats projets: ${error.message}`);
      throw error;
    }
  }

  // Statistiques des employés
  async getEmployeeStats() {
    try {
      const total = await Employee.count();
      const active = await Employee.count({ where: { isActive: true } });

      return {
        total,
        active,
        inactive: total - active
      };
    } catch (error) {
      logger.error(`Erreur stats employés: ${error.message}`);
      throw error;
    }
  }

  // Statistiques financières
  async getFinancialStats() {
    try {
      // Factures payées
      const paidInvoices = await Invoice.sum('totalAmount', {
        where: { status: INVOICE_STATUS.PAID }
      });

      // Factures en attente
      const pendingInvoices = await Invoice.sum('totalAmount', {
        where: { 
          status: {
            [Op.in]: [INVOICE_STATUS.SENT, INVOICE_STATUS.DRAFT]
          }
        }
      });

      // Factures en retard
      const overdueInvoices = await Invoice.sum('totalAmount', {
        where: { 
          status: INVOICE_STATUS.OVERDUE
        }
      });

      // Dépenses totales
      const totalExpenses = await Expense.sum('amount');

      return {
        totalRevenue: parseFloat(paidInvoices || 0),
        pendingRevenue: parseFloat(pendingInvoices || 0),
        overdueRevenue: parseFloat(overdueInvoices || 0),
        totalExpenses: parseFloat(totalExpenses || 0),
        netProfit: parseFloat(paidInvoices || 0) - parseFloat(totalExpenses || 0)
      };
    } catch (error) {
      logger.error(`Erreur stats financières: ${error.message}`);
      throw error;
    }
  }

  // Projets récents
  async getRecentProjects(limit = 5) {
    try {
      const projects = await Project.findAll({
        include: [
          { model: User, as: 'manager', attributes: ['firstName', 'lastName'] }
        ],
        order: [['createdAt', 'DESC']],
        limit
      });

      return projects;
    } catch (error) {
      logger.error(`Erreur projets récents: ${error.message}`);
      throw error;
    }
  }

  // Activités récentes
  async getRecentActivities(limit = 10) {
    try {
      const [projects, invoices, expenses] = await Promise.all([
        Project.findAll({ 
          order: [['updatedAt', 'DESC']], 
          limit: 3,
          attributes: ['id', 'name', 'status', 'updatedAt']
        }),
        Invoice.findAll({ 
          order: [['createdAt', 'DESC']], 
          limit: 3,
          attributes: ['id', 'invoiceNumber', 'amount', 'status', 'createdAt']
        }),
        Expense.findAll({ 
          order: [['createdAt', 'DESC']], 
          limit: 3,
          attributes: ['id', 'description', 'amount', 'createdAt']
        })
      ]);

      const activities = [];

      projects.forEach(p => {
        activities.push({
          type: 'project',
          id: p.id,
          message: `Projet "${p.name}" - Statut: ${p.status}`,
          date: p.updatedAt
        });
      });

      invoices.forEach(i => {
        activities.push({
          type: 'invoice',
          id: i.id,
          message: `Facture ${i.invoiceNumber} - Montant: ${i.amount}€`,
          date: i.createdAt
        });
      });

      expenses.forEach(e => {
        activities.push({
          type: 'expense',
          id: e.id,
          message: `Dépense: ${e.description} - ${e.amount}€`,
          date: e.createdAt
        });
      });

      activities.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return activities.slice(0, limit);
    } catch (error) {
      logger.error(`Erreur activités récentes: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new DashboardService();