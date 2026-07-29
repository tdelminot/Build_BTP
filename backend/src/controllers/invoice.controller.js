const invoiceService = require('../services/invoice.service');
const logger = require('../middleware/logger');

class InvoiceController {
  // Créer une facture
  async create(req, res, next) {
    try {
      const invoice = await invoiceService.createInvoice(req.body);

      res.status(201).json({
        success: true,
        message: 'Facture créée avec succès',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir toutes les factures
  async getAll(req, res, next) {
    try {
      const { page, limit, status, clientId, projectId, startDate, endDate } = req.query;
      const result = await invoiceService.getAllInvoices({
        page,
        limit,
        status,
        clientId,
        projectId,
        startDate,
        endDate
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir une facture par ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.getInvoiceById(id);

      res.status(200).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Mettre à jour une facture
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.updateInvoice(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Facture mise à jour avec succès',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Envoyer une facture (changer statut en SENT)
  async sendInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await invoiceService.sendInvoice(id);

      res.status(200).json({
        success: true,
        message: 'Facture envoyée avec succès',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  // Enregistrer un paiement
  async recordPayment(req, res, next) {
    try {
      const { id } = req.params;
      const paymentData = req.body;
      
      const result = await invoiceService.recordPayment(id, paymentData);

      res.status(200).json({
        success: true,
        message: 'Paiement enregistré avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les factures en retard
  async getOverdue(req, res, next) {
    try {
      const invoices = await invoiceService.getOverdueInvoices();

      res.status(200).json({
        success: true,
        data: invoices
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtenir les statistiques
  async getStats(req, res, next) {
    try {
      const stats = await invoiceService.getInvoiceStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Supprimer une facture
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await invoiceService.deleteInvoice(id);

      res.status(200).json({
        success: true,
        message: 'Facture supprimée avec succès'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();