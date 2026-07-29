const { Team, Employee } = require('../models');
const { Op } = require('sequelize');

class TeamService {
  async getAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const where = search ? { name: { [Op.like]: `%${search}%` } } : {};
    
    const { count, rows } = await Team.findAndCountAll({
      where,
      include: [{ model: Employee, as: 'members', attributes: ['id', 'firstName', 'lastName'] }],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { teams: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const team = await Team.findByPk(id, {
      include: [{ model: Employee, as: 'members' }]
    });
    if (!team) throw new Error('Équipe non trouvée');
    return team;
  }

  async create(data) {
    return await Team.create(data);
  }

  async update(id, data) {
    const team = await this.getById(id);
    await team.update(data);
    return team;
  }

  async delete(id) {
    const team = await this.getById(id);
    await team.destroy();
    return true;
  }
}

module.exports = new TeamService();