const supplierService = require('../services/supplier.service');

class SupplierController {
  async getAll(req, res, next) {
    try {
      const result = await supplierService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const supplier = await supplierService.getById(req.params.id);
      res.status(200).json({ success: true, data: supplier });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const supplier = await supplierService.create(req.body);
      res.status(201).json({ success: true, data: supplier });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const supplier = await supplierService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: supplier });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      await supplierService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Fournisseur supprimé' });
    } catch (error) { next(error); }
  }
}

module.exports = new SupplierController();