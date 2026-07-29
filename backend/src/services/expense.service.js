const { Expense, Project, User } = require('../models');
const { Op } = require('sequelize');

class ExpenseService {
  async getAll({ page = 1, limit = 10, search = '', type = '', projectId = '', startDate = '', endDate = '' }) {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (type) where.type = type;
    if (projectId) where.projectId = projectId;
    
    // coRRECTION
    if (search) {
      where.descrciption = { [Op.like]: `%${search}%` };
    }
    
    if (startDate && endDate) {
      where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    
    const { count, rows } = await Expense.findAndCountAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { expenses: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const expense = await Expense.findByPk(id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'user' }
      ]
    });
    if (!expense) throw new Error('Dépense non trouvée');
    return expense;
  }

  async create(data) {
    return await Expense.create(data);
  }

  async update(id, data) {
    const expense = await this.getById(id);
    await expense.update(data);
    return expense;
  }

  async delete(id) {
    const expense = await this.getById(id);
    await expense.destroy();
    return true;
  }
}

module.exports = new ExpenseService();