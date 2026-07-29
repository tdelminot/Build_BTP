const { Client } = require('../models');
const { Op } = require('sequelize');

class ClientService {
  async getAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const where = search ? { name: { [Op.like]: `%${search}%` } } : {};
    
    const { count, rows } = await Client.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { clients: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const client = await Client.findByPk(id);
    if (!client) throw new Error('Client non trouvé');
    return client;
  }

  async create(data) {
    return await Client.create(data);
  }

  async update(id, data) {
    const client = await this.getById(id);
    await client.update(data);
    return client;
  }

  async delete(id) {
    const client = await this.getById(id);
    await client.destroy();
    return true;
  }
}

module.exports = new ClientService();