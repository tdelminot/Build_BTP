const teamService = require('../services/team.service');

class TeamController {
  async getAll(req, res, next) {
    try {
      const result = await teamService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const team = await teamService.getById(req.params.id);
      res.status(200).json({ success: true, data: team });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const team = await teamService.create(req.body);
      res.status(201).json({ success: true, data: team });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const team = await teamService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: team });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await teamService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Équipe supprimée' });
    } catch (error) { next(error); }
  }
}

module.exports = new TeamController();