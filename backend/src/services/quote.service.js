const { Quote, Client, Project, User } = require('../models');
const { Op } = require('sequelize');

class QuoteService {
  async getAll({ page = 1, limit = 10, search = '', status = '' }) {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (status) where.status = status;
    
    // Utiliser la variable search correctement
    if (search) {
      where.quote_number = { [Op.like]: `%${search}%` };
    }
    
    const { count, rows } = await Quote.findAndCountAll({
      where,
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { quotes: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const quote = await Quote.findByPk(id, {
      include: [
        { model: Client, as: 'client' },
        { model: Project, as: 'project' },
        { model: User, as: 'creator' }
      ]
    });
    if (!quote) throw new Error('Devis non trouvé');
    return quote;
  }

  async create(data) {
    return await Quote.create(data);
  }

  async update(id, data) {
    const quote = await this.getById(id);
    await quote.update(data);
    return quote;
  }

  async delete(id) {
    const quote = await this.getById(id);
    await quote.destroy();
    return true;
  }
}

module.exports = new QuoteService();