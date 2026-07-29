const { Task, Project, Employee, User } = require('../models');
const { Op } = require('sequelize');

class TaskService {
  async getAll({ page = 1, limit = 10, search = '', status = '', projectId = '' }) {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    
    
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    
    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: Employee, as: 'assignedEmployee', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { tasks: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const task = await Task.findByPk(id, {
      include: [
        { model: Project, as: 'project' },
        { model: Employee, as: 'assignedEmployee' },
        { model: User, as: 'creator' }
      ]
    });
    if (!task) throw new Error('Tâche non trouvée');
    return task;
  }

  async create(data) {
    return await Task.create(data);
  }

  async update(id, data) {
    const task = await this.getById(id);
    await task.update(data);
    return task;
  }

  async delete(id) {
    const task = await this.getById(id);
    await task.destroy();
    return true;
  }
}

module.exports = new TaskService();