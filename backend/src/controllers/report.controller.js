const reportService = require('../services/report.service');
const logger = require('../middleware/logger');

class ReportController {
  async getFinancialReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getFinancialReport(startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async getProjectReport(req, res, next) {
    try {
      const { id } = req.params;
      const report = await reportService.getProjectReport(id);
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async getExpenseReport(req, res, next) {
    try {
      const { startDate, endDate, projectId } = req.query;
      const report = await reportService.getExpenseReport(startDate, endDate, projectId);
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async getProfitabilityReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getProfitabilityReport(startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async getHRReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getHRReport(startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async getMaterialReport(req, res, next) {
    try {
      const report = await reportService.getMaterialReport();
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async getGlobalReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getGlobalReport(startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) { next(error); }
  }

  async exportPDF(req, res, next) {
    try {
      const { type, startDate, endDate } = req.query;
      const pdfBuffer = await reportService.exportPDF(type, startDate, endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=rapport-${type}-${Date.now()}.pdf`);
      res.send(pdfBuffer);
    } catch (error) { next(error); }
  }
}

module.exports = new ReportController();