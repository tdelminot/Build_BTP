const clientService = require('../services/client.service');

class ClientController {
  async getAll(req, res, next) {
    try {
      const result = await clientService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const client = await clientService.getById(req.params.id);
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const client = await clientService.create(req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const client = await clientService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: client });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await clientService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Client supprimé' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientController();