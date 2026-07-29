const { Project, Employee, Invoice, Expense, Material, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../middleware/logger');
const { PROJECT_STATUS, INVOICE_STATUS } = require('../utils/constants');

class ReportService {
  // Rapport financier global
  async getFinancialReport(startDate, endDate) {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      // Chiffre d'affaires
      const revenue = await Invoice.sum('totalAmount', {
        where: {
          ...dateFilter,
          status: INVOICE_STATUS.PAID
        }
      });

      // Dépenses
      const expenses = await Expense.sum('amount', {
        where: dateFilter
      });

      // Factures en attente
      const pending = await Invoice.sum('totalAmount', {
        where: {
          ...dateFilter,
          status: {
            [Op.in]: [INVOICE_STATUS.SENT, INVOICE_STATUS.DRAFT]
          }
        }
      });

      // Marge
      const margin = (revenue || 0) - (expenses || 0);
      const marginRate = revenue > 0 ? (margin / revenue) * 100 : 0;

      return {
        period: {
          startDate: startDate || 'Début',
          endDate: endDate || 'Aujourd\'hui'
        },
        revenue: parseFloat(revenue || 0),
        expenses: parseFloat(expenses || 0),
        pendingRevenue: parseFloat(pending || 0),
        margin: parseFloat(margin),
        marginRate: Math.round(marginRate * 100) / 100,
        summary: {
          totalProjects: await Project.count({ where: dateFilter }),
          totalInvoices: await Invoice.count({ where: dateFilter }),
          totalExpenses: await Expense.count({ where: dateFilter })
        }
      };
    } catch (error) {
      logger.error(`Erreur rapport financier: ${error.message}`);
      throw error;
    }
  }

  // Rapport par projet
  async getProjectReport(projectId) {
    try {
      const project = await Project.findByPk(projectId, {
        include: [
          { model: Expense, as: 'expenses' },
          { model: Invoice, as: 'invoices' },
          { model: Employee, as: 'employees' }
        ]
      });

      if (!project) {
        const error = new Error('Projet non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      const totalExpenses = project.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const totalInvoices = project.invoices.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
      const paidInvoices = project.invoices
        .filter(i => i.status === INVOICE_STATUS.PAID)
        .reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);

      const budget = parseFloat(project.budget);
      const margin = totalInvoices - totalExpenses;
      const budgetVariance = budget - totalExpenses;

      return {
        project: {
          id: project.id,
          name: project.name,
          reference: project.reference,
          status: project.status,
          progress: project.progress,
          startDate: project.startDate,
          endDate: project.endDate
        },
        financial: {
          budget,
          totalExpenses,
          totalInvoices,
          paidInvoices,
          pendingInvoices: totalInvoices - paidInvoices,
          margin,
          marginRate: totalInvoices > 0 ? (margin / totalInvoices) * 100 : 0,
          budgetVariance,
          budgetStatus: budgetVariance >= 0 ? 'BON' : 'DÉPASSEMENT'
        },
        resources: {
          totalEmployees: project.employees.length,
          totalExpensesCount: project.expenses.length,
          totalInvoicesCount: project.invoices.length
        },
        expensesByType: project.expenses.reduce((acc, e) => {
          acc[e.type] = (acc[e.type] || 0) + parseFloat(e.amount);
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error(`Erreur rapport projet ${projectId}: ${error.message}`);
      throw error;
    }
  }

  // Rapport des dépenses
  async getExpenseReport(startDate, endDate, projectId = null) {
    try {
      const where = {};
      
      if (startDate && endDate) {
        where.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      if (projectId) {
        where.projectId = projectId;
      }

      const expenses = await Expense.findAll({
        where,
        include: [
          { model: Project, as: 'project', attributes: ['id', 'name', 'reference'] },
          { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }
        ],
        order: [['date', 'DESC']]
      });

      const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      const byType = expenses.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + parseFloat(e.amount);
        return acc;
      }, {});

      const byProject = expenses.reduce((acc, e) => {
        const key = e.Project ? e.Project.name : 'Sans projet';
        acc[key] = (acc[key] || 0) + parseFloat(e.amount);
        return acc;
      }, {});

      return {
        period: {
          startDate: startDate || 'Début',
          endDate: endDate || 'Aujourd\'hui'
        },
        totalAmount,
        count: expenses.length,
        byType,
        byProject,
        expenses,
        summary: {
          averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0,
          maxAmount: expenses.length > 0 ? Math.max(...expenses.map(e => parseFloat(e.amount))) : 0,
          minAmount: expenses.length > 0 ? Math.min(...expenses.map(e => parseFloat(e.amount))) : 0
        }
      };
    } catch (error) {
      logger.error(`Erreur rapport dépenses: ${error.message}`);
      throw error;
    }
  }

  // Rapport de rentabilité
  async getProfitabilityReport(startDate, endDate) {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const projects = await Project.findAll({
        where: dateFilter,
        include: [
          { model: Expense, as: 'expenses' },
          { model: Invoice, as: 'invoices' }
        ]
      });

      const profitability = projects.map(p => {
        const totalExpenses = p.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const totalInvoices = p.invoices.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
        const margin = totalInvoices - totalExpenses;
        const marginRate = totalInvoices > 0 ? (margin / totalInvoices) * 100 : 0;

        return {
          projectId: p.id,
          projectName: p.name,
          status: p.status,
          budget: parseFloat(p.budget),
          totalExpenses,
          totalInvoices,
          margin,
          marginRate: Math.round(marginRate * 100) / 100,
          isProfitable: margin > 0
        };
      });

      const profitable = profitability.filter(p => p.isProfitable);
      const unprofitable = profitability.filter(p => !p.isProfitable);

      return {
        period: {
          startDate: startDate || 'Début',
          endDate: endDate || 'Aujourd\'hui'
        },
        projects: profitability,
        summary: {
          totalProjects: profitability.length,
          profitableCount: profitable.length,
          unprofitableCount: unprofitable.length,
          averageMargin: profitability.length > 0 
            ? profitability.reduce((sum, p) => sum + p.margin, 0) / profitability.length 
            : 0,
          totalMargin: profitability.reduce((sum, p) => sum + p.margin, 0)
        }
      };
    } catch (error) {
      logger.error(`Erreur rapport rentabilité: ${error.message}`);
      throw error;
    }
  }

  // Rapport RH
  async getHRReport(startDate, endDate) {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.hireDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const employees = await Employee.findAll({
        where: dateFilter,
        include: [
          { model: Team, as: 'team' },
          { model: Project, as: 'projects' }
        ]
      });

      const total = employees.length;
      const active = employees.filter(e => e.isActive).length;
      const byPosition = employees.reduce((acc, e) => {
        acc[e.position] = (acc[e.position] || 0) + 1;
        return acc;
      }, {});

      const byTeam = employees.reduce((acc, e) => {
        const teamName = e.Team ? e.Team.name : 'Sans équipe';
        acc[teamName] = (acc[teamName] || 0) + 1;
        return acc;
      }, {});

      // Projets par employé
      const projectsPerEmployee = employees.map(e => ({
        employee: `${e.firstName} ${e.lastName}`,
        projectCount: e.projects.length
      }));

      return {
        period: {
          startDate: startDate || 'Début',
          endDate: endDate || 'Aujourd\'hui'
        },
        employees: {
          total,
          active,
          inactive: total - active,
          byPosition,
          byTeam,
          projectsPerEmployee
        },
        summary: {
          averageProjectsPerEmployee: total > 0 
            ? projectsPerEmployee.reduce((sum, p) => sum + p.projectCount, 0) / total 
            : 0
        }
      };
    } catch (error) {
      logger.error(`Erreur rapport RH: ${error.message}`);
      throw error;
    }
  }

  // Rapport des matériels
  async getMaterialReport() {
    try {
      const materials = await Material.findAll({
        include: [
          { model: Supplier, as: 'supplier' },
          { model: Project, as: 'projects' }
        ]
      });

      const totalItems = materials.length;
      const totalValue = materials.reduce((sum, m) => sum + (parseFloat(m.quantity) * parseFloat(m.unitPrice)), 0);
      const lowStock = materials.filter(m => m.quantity <= m.minQuantity);

      const byCategory = materials.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + parseFloat(m.quantity);
        return acc;
      }, {});

      return {
        materials: {
          totalItems,
          totalValue,
          lowStockCount: lowStock.length,
          byCategory
        },
        lowStock: lowStock.map(m => ({
          id: m.id,
          name: m.name,
          reference: m.reference,
          quantity: m.quantity,
          minQuantity: m.minQuantity
        })),
        summary: {
          averageValuePerItem: totalItems > 0 ? totalValue / totalItems : 0,
          mostUsedCategory: Object.keys(byCategory).reduce((a, b) => byCategory[a] > byCategory[b] ? a : b, ''),
          supplyStatus: lowStock.length === 0 ? 'OK' : 'Attention: Stock bas'
        }
      };
    } catch (error) {
      logger.error(`Erreur rapport matériels: ${error.message}`);
      throw error;
    }
  }

  // Rapport global
  async getGlobalReport(startDate, endDate) {
    try {
      const [
        financial,
        projects,
        employees,
        materials
      ] = await Promise.all([
        this.getFinancialReport(startDate, endDate),
        this.getProjectStats(startDate, endDate),
        this.getEmployeeStats(),
        this.getMaterialReport()
      ]);

      return {
        period: {
          startDate: startDate || 'Début',
          endDate: endDate || 'Aujourd\'hui'
        },
        financial,
        projects,
        employees,
        materials,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Erreur rapport global: ${error.message}`);
      throw error;
    }
  }

  // Statistiques projets (helper)
  async getProjectStats(startDate, endDate) {
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const total = await Project.count({ where: dateFilter });
    const byStatus = await Project.findAll({
      where: dateFilter,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    const totalBudget = await Project.sum('budget', { where: dateFilter });
    const totalCost = await Project.sum('actualCost', { where: dateFilter });

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.get('count'));
        return acc;
      }, {}),
      totalBudget: parseFloat(totalBudget || 0),
      totalCost: parseFloat(totalCost || 0)
    };
  }

  // Statistiques employés (helper)
  async getEmployeeStats() {
    const total = await Employee.count();
    const active = await Employee.count({ where: { isActive: true } });

    return {
      total,
      active,
      inactive: total - active
    };
  }
}

module.exports = new ReportService();