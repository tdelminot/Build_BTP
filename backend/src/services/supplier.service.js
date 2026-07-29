const { Supplier } = require('../models');
const { Op } = require('sequelize');

class SupplierService {
  async getAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const where = search ? { name: { [Op.like]: `%${search}%` } } : {};
    
    const { count, rows } = await Supplier.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { suppliers: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) throw new Error('Fournisseur non trouvé');
    return supplier;
  }

  async create(data) {
    return await Supplier.create(data);
  }

  async update(id, data) {
    const supplier = await this.getById(id);
    await supplier.update(data);
    return supplier;
  }

  async delete(id) {
    const supplier = await this.getById(id);
    await supplier.destroy();
    return true;
  }
}

module.exports = new SupplierService();