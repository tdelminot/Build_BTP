const dashboardService = require('../services/dashboard.service');

class DashboardController {
  // Obtenir toutes les données du dashboard
  async getDashboard(req, res, next) {
    try {
      const data = await dashboardService.getDashboardData();

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques des projets
  async getProjectStats(req, res, next) {
    try {
      const stats = await dashboardService.getProjectStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques des employés
  async getEmployeeStats(req, res, next) {
    try {
      const stats = await dashboardService.getEmployeeStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques financières
  async getFinancialStats(req, res, next) {
    try {
      const stats = await dashboardService.getFinancialStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les activités récentes
  async getRecentActivities(req, res, next) {
    try {
      const { limit } = req.query;
      const activities = await dashboardService.getRecentActivities(limit);

      res.status(200).json({
        success: true,
        data: activities
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();