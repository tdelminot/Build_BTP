const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class UserService {
  async getAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const where = search ? { 
      [Op.or]: [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : {};
    
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
      order: [['firstName', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return { users: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) };
  }

  async getById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
    });
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
  }

  async create(data) {
    // Hasher le mot de passe
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return await User.create(data);
  }

  async update(id, data) {
    const user = await this.getById(id);
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    await user.update(data);
    return user;
  }

  async delete(id) {
    const user = await this.getById(id);
    await user.destroy();
    return true;
  }
}

module.exports = new UserService();