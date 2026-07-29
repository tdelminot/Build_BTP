const userService = require('../services/user.service');

class UserController {
  async getAll(req, res, next) {
    try {
      const result = await userService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await userService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) { next(error); }
  }
}

module.exports = new UserController();