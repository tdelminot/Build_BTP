const expenseService = require('../services/expense.service');

class ExpenseController {
  async getAll(req, res, next) {
    try {
      const result = await expenseService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const expense = await expenseService.getById(req.params.id);
      res.status(200).json({ success: true, data: expense });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const expense = await expenseService.create(req.body);
      res.status(201).json({ success: true, data: expense });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const expense = await expenseService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: expense });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await expenseService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Dépense supprimée' });
    } catch (error) { next(error); }
  }
}

module.exports = new ExpenseController();
