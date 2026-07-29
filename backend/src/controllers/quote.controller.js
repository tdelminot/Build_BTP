const quoteService = require('../services/quote.service');

class QuoteController {
  async getAll(req, res, next) {
    try {
      const result = await quoteService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const quote = await quoteService.getById(req.params.id);
      res.status(200).json({ success: true, data: quote });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const quote = await quoteService.create(req.body);
      res.status(201).json({ success: true, data: quote });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const quote = await quoteService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: quote });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await quoteService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Devis supprimé' });
    } catch (error) { next(error); }
  }
}

module.exports = new QuoteController();
