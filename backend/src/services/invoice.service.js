const { Invoice, Client, Project, User, Payment, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../middleware/logger');
const { generateReference } = require('../utils/helpers');
const { INVOICE_STATUS } = require('../utils/constants');

class InvoiceService {
  // Créer une facture
  async createInvoice(invoiceData) {
    try {
      // Générer un numéro unique
      invoiceData.invoiceNumber = generateReference('FAC', 8);

      // Calculer le total
      const taxAmount = invoiceData.amount * 0.20; // TVA 20%
      invoiceData.totalAmount = invoiceData.amount + taxAmount;
      invoiceData.taxAmount = taxAmount;

      const invoice = await Invoice.create(invoiceData);
      
      logger.info(`Facture créée: ${invoice.invoiceNumber} (${invoice.id})`);
      return invoice;
    } catch (error) {
      logger.error(`Erreur création facture: ${error.message}`);
      throw error;
    }
  }

  // Obtenir toutes les factures
  async getAllInvoices({ 
    page = 1, 
    limit = 10, 
    status = '', 
    clientId = '', 
    projectId = '',
    startDate = '',
    endDate = ''
  }) {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (status) {
        where.status = status;
      }

      if (clientId) {
        where.clientId = clientId;
      }

      if (projectId) {
        where.projectId = projectId;
      }

      if (startDate && endDate) {
        where.issueDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const { count, rows } = await Invoice.findAndCountAll({
        where,
        include: [
          { model: Client, as: 'client', attributes: ['id', 'name', 'email'] },
          { model: Project, as: 'project', attributes: ['id', 'name', 'reference'] },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        invoices: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error(`Erreur récupération factures: ${error.message}`);
      throw error;
    }
  }

  // Obtenir une facture par ID
  async getInvoiceById(invoiceId) {
    try {
      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          { model: Client, as: 'client' },
          { model: Project, as: 'project' },
          { model: User, as: 'creator' },
          { model: Payment, as: 'payments' }
        ]
      });

      if (!invoice) {
        const error = new Error('Facture non trouvée');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Calculer le montant payé
      const paidAmount = invoice.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const remainingAmount = parseFloat(invoice.totalAmount) - paidAmount;

      return {
        ...invoice.toJSON(),
        paidAmount,
        remainingAmount
      };
    } catch (error) {
      logger.error(`Erreur récupération facture ${invoiceId}: ${error.message}`);
      throw error;
    }
  }

  // Mettre à jour une facture
  async updateInvoice(invoiceId, updateData) {
    try {
      const invoice = await Invoice.findByPk(invoiceId);
      
      if (!invoice) {
        const error = new Error('Facture non trouvée');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Ne pas permettre la modification si la facture est déjà payée
      if (invoice.status === INVOICE_STATUS.PAID) {
        const error = new Error('Impossible de modifier une facture déjà payée');
        error.isCustom = true;
        error.statusCode = 400;
        throw error;
      }

      await invoice.update(updateData);
      
      logger.info(`Facture mise à jour: ${invoice.invoiceNumber}`);
      return invoice;
    } catch (error) {
      logger.error(`Erreur mise à jour facture ${invoiceId}: ${error.message}`);
      throw error;
    }
  }

  // Envoyer une facture
  async sendInvoice(invoiceId) {
    try {
      const invoice = await Invoice.findByPk(invoiceId);
      
      if (!invoice) {
        const error = new Error('Facture non trouvée');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier que la facture est en brouillon
      if (invoice.status !== INVOICE_STATUS.DRAFT) {
        const error = new Error('Seules les factures en brouillon peuvent être envoyées');
        error.isCustom = true;
        error.statusCode = 400;
        throw error;
      }

      await invoice.update({ status: INVOICE_STATUS.SENT });
      
      logger.info(`Facture envoyée: ${invoice.invoiceNumber}`);
      return invoice;
    } catch (error) {
      logger.error(`Erreur envoi facture ${invoiceId}: ${error.message}`);
      throw error;
    }
  }

  // Enregistrer un paiement
  async recordPayment(invoiceId, paymentData) {
    try {
      const invoice = await Invoice.findByPk(invoiceId);
      
      if (!invoice) {
        const error = new Error('Facture non trouvée');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Vérifier que la facture n'est pas déjà payée
      if (invoice.status === INVOICE_STATUS.PAID) {
        const error = new Error('Cette facture est déjà payée');
        error.isCustom = true;
        error.statusCode = 400;
        throw error;
      }

      // Créer le paiement
      const payment = await Payment.create({
        ...paymentData,
        invoiceId
      });

      // Calculer le montant total payé
      const payments = await Payment.findAll({
        where: { invoiceId }
      });
      const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

      // Mettre à jour le statut de la facture
      let newStatus = INVOICE_STATUS.SENT;
      if (totalPaid >= parseFloat(invoice.totalAmount)) {
        newStatus = INVOICE_STATUS.PAID;
        await invoice.update({
          status: newStatus,
          paymentDate: new Date()
        });
      } else if (totalPaid > 0) {
        newStatus = INVOICE_STATUS.SENT;
        await invoice.update({ status: newStatus });
      }

      logger.info(`Paiement enregistré pour la facture ${invoice.invoiceNumber}: ${payment.amount}€`);
      return {
        payment,
        totalPaid,
        remainingAmount: parseFloat(invoice.totalAmount) - totalPaid,
        status: newStatus
      };
    } catch (error) {
      logger.error(`Erreur enregistrement paiement ${invoiceId}: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les factures en retard
  async getOverdueInvoices() {
    try {
      const invoices = await Invoice.findAll({
        where: {
          status: INVOICE_STATUS.SENT,
          dueDate: {
            [Op.lt]: new Date()
          }
        },
        include: [
          { model: Client, as: 'client' },
          { model: Project, as: 'project' }
        ],
        order: [['dueDate', 'ASC']]
      });

      return invoices;
    } catch (error) {
      logger.error(`Erreur récupération factures en retard: ${error.message}`);
      throw error;
    }
  }

  // Obtenir les statistiques
  async getInvoiceStats() {
    try {
      const total = await Invoice.count();
      const byStatus = await Invoice.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      const totalAmount = await Invoice.sum('totalAmount');
      const paidAmount = await Invoice.sum('totalAmount', {
        where: { status: INVOICE_STATUS.PAID }
      });

      const overdueInvoices = await this.getOverdueInvoices();

      return {
        total: {
          count: total,
          amount: parseFloat(totalAmount || 0)
        },
        paid: {
          count: byStatus.find(s => s.status === INVOICE_STATUS.PAID)?.get('count') || 0,
          amount: parseFloat(paidAmount || 0)
        },
        overdue: {
          count: overdueInvoices.length,
          amount: overdueInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0)
        },
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.get('count'));
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error(`Erreur récupération stats factures: ${error.message}`);
      throw error;
    }
  }

  // Supprimer une facture
  async deleteInvoice(invoiceId) {
    try {
      const invoice = await Invoice.findByPk(invoiceId);
      
      if (!invoice) {
        const error = new Error('Facture non trouvée');
        error.isCustom = true;
        error.statusCode = 404;
        throw error;
      }

      // Ne pas supprimer si la facture a des paiements
      const payments = await Payment.count({ where: { invoiceId } });
      if (payments > 0) {
        const error = new Error('Impossible de supprimer une facture avec des paiements');
        error.isCustom = true;
        error.statusCode = 400;
        throw error;
      }

      await invoice.destroy();
      
      logger.info(`Facture supprimée: ${invoice.invoiceNumber}`);
      return true;
    } catch (error) {
      logger.error(`Erreur suppression facture ${invoiceId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new InvoiceService();