const employeeService = require('../services/employee.service');

class EmployeeController {
  // Créer un employé
  async create(req, res, next) {
    try {
      const employee = await employeeService.createEmployee(req.body);

      res.status(201).json({
        success: true,
        message: 'Employé créé avec succès',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir tous les employés
  async getAll(req, res, next) {
    try {
      const { page, limit, search, teamId } = req.query;
      const result = await employeeService.getAllEmployees({ 
        page, 
        limit, 
        search, 
        teamId 
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir un employé par ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await employeeService.getEmployeeById(id);

      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour un employé
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await employeeService.updateEmployee(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Employé mis à jour avec succès',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  // Affecter à une équipe
  async assignToTeam(req, res, next) {
    try {
      const { id } = req.params;
      const { teamId } = req.body;
      
      const employee = await employeeService.assignToTeam(id, teamId);

      res.status(200).json({
        success: true,
        message: 'Employé affecté à l\'équipe avec succès',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  // Enregistrer une présence
  async recordAttendance(req, res, next) {
    try {
      const attendance = await employeeService.recordAttendance(req.body);

      res.status(201).json({
        success: true,
        message: 'Présence enregistrée avec succès',
        data: attendance
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les présences
  async getAttendance(req, res, next) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      const attendances = await employeeService.getEmployeeAttendance(
        id, 
        startDate, 
        endDate
      );

      res.status(200).json({
        success: true,
        data: attendances
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques
  async getStats(req, res, next) {
    try {
      const stats = await employeeService.getEmployeeStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();