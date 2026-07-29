const { Employee, Team, Project, Attendance } = require('../models');
const { Op } = require('sequelize');
const logger = require('../middleware/logger');

class EmployeeService {
  // Créer un employé
  async createEmployee(employeeData) {
    try {
      const existingEmployee = await Employee.findOne({
        where: { email: employeeData.email }
      });

      if (existingEmployee) {
        const error = new Error('Cet email est déjà utilisé');
        error.isCustom = true;
        error.statusCode = 409;
        throw error;
      }

      const employee = await Employee.create(employeeData);
      
      logger.info(`Employé créé: ${employee.firstName} ${employee.lastName} (${employee.id})`);
      return employee;
    } catch (error) {
      logger.error(`Erreur création employé: ${error.message}`);
      throw error;
    }
  }

  // Obtenir tous les employés
  async getAllEmployees({ page = 1, limit = 10, search = '', teamId = null }) {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { position: { [Op.like]: `%${search}%` } }
        ];
      }

      if (teamId) {
        where.teamId = teamId;
      }

      const { count, rows } = await Employee.findAndCountAll({
        where,
        include: [
          { model: Team, as: 'team', attributes: ['id', 'name'] }
        ],
        order: [['lastName', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        employees: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error(`Erreur récupération employés: ${error.message}`);
      throw error;
    }
  }

  // Obtenir un employé par ID
  async getEmployeeById(employeeId) {
    try {
      const employee = await Employee.findByPk(employeeId, {
        include: [
          { model: Team, as: 'team', attributes: ['id', 'name'] },
          { 
            model: Project, 
            as: 'projects',
            through: { attributes: [] },
            attributes: ['id', 'name', 'status', 'startDate', 'endDate']
          },
          { 
            model: Attendance, 
            as: 'attendances',
            limit: 30,
            order: [['date', 'DESC']]
          }
        ]
      });

      if (!employee) {
        const error = new Error('Employé non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      return employee;
    } catch (error) {
      logger.error(`Erreur récupération employé ${employeeId}: ${error.message}`);
      throw error;
    }
  }

  // Mettre à jour un employé
  async updateEmployee(employeeId, updateData) {
    try {
      const employee = await Employee.findByPk(employeeId);
      
      if (!employee) {
        const error = new Error('Employé non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await employee.update(updateData);
      
      logger.info(`Employé mis à jour: ${employee.firstName} ${employee.lastName}`);
      return employee;
    } catch (error) {
      logger.error(`Erreur mise à jour employé ${employeeId}: ${error.message}`);
      throw error;
    }
  }

  // Affecter à une équipe
  async assignToTeam(employeeId, teamId) {
    try {
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        const error = new Error('Employé non trouvé');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      await employee.update({ teamId });
      
      logger.info(`Employé ${employee.firstName} ${employee.lastName} affecté à l'équipe ${teamId}`);
      return employee;
    } catch (error) {
      logger.error(`Erreur affectation équipe ${employeeId}: ${error.message}`);
      throw error;
    }
  }

  // Enregistrer une présence
  async recordAttendance(attendanceData) {
    try {
      const [attendance, created] = await Attendance.findOrCreate({
        where: {
          employeeId: attendanceData.employeeId,
          date: attendanceData.date
        },
        defaults: attendanceData
      });

      if (!created) {
        // Mettre à jour si déjà existant
        await attendance.update(attendanceData);
      }

      logger.info(`Présence enregistrée pour employé ${attendanceData.employeeId} le ${attendanceData.date}`);
      return attendance;
    } catch (error) {
      logger.error(`Erreur enregistrement présence: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les présences d'un employé
  async getEmployeeAttendance(employeeId, startDate, endDate) {
    try {
      const attendances = await Attendance.findAll({
        where: {
          employeeId,
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'DESC']]
      });

      return attendances;
    } catch (error) {
      logger.error(`Erreur récupération présences ${employeeId}: ${error.message}`);
      throw error;
    }
  }

  // Statistiques des employés
  async getEmployeeStats() {
    try {
      const total = await Employee.count();
      const active = await Employee.count({ where: { isActive: true } });
      const byTeam = await Employee.findAll({
        attributes: [
          'teamId',
          [sequelize.fn('COUNT', sequelize.col('teamId')), 'count']
        ],
        group: ['teamId'],
        include: [{ model: Team, as: 'team', attributes: ['name'] }]
      });

      return {
        total,
        active,
        inactive: total - active,
        byTeam: byTeam.map(item => ({
          teamName: item.Team ? item.Team.name : 'Sans équipe',
          count: parseInt(item.get('count'))
        }))
      };
    } catch (error) {
      logger.error(`Erreur récupération stats employés: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new EmployeeService();