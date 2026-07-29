const taskService = require('../services/task.service');

class TaskController {
  async getAll(req, res, next) {
    try {
      const result = await taskService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const task = await taskService.getById(req.params.id);
      res.status(200).json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const task = await taskService.create(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: task });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await taskService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Tâche supprimée' });
    } catch (error) { next(error); }
  }
}

module.exports = new TaskController();
