const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report.controller');
const { jwtAuth, checkRole } = require('../../middleware/auth/jwtAuth');
const { ROLES } = require('../../utils/constants');

// Routes protégées - accessibles uniquement aux admins et managers
router.use(jwtAuth);
router.use(checkRole([ROLES.ADMIN, ROLES.MANAGER]));

// Rapports financiers
router.get('/financial', reportController.getFinancialReport);
router.get('/profitability', reportController.getProfitabilityReport);

// Rapports par projet
router.get('/project/:id', reportController.getProjectReport);

// Rapports des dépenses
router.get('/expenses', reportController.getExpenseReport);

// Rapports RH
router.get('/hr', reportController.getHRReport);

// Rapports matériels
router.get('/materials', reportController.getMaterialReport);

// Rapport global
router.get('/global', reportController.getGlobalReport);

// Export PDF (admin uniquement)
router.get(
  '/export/pdf',
  checkRole([ROLES.ADMIN]),
  reportController.exportPDF
);

module.exports = router;