const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard.controller');
const { jwtAuth } = require('../../middleware/auth/jwtAuth');

// Toutes les routes du dashboard sont protégées
router.use(jwtAuth);

router.get('/', dashboardController.getDashboard);
router.get('/projects', dashboardController.getProjectStats);
router.get('/employees', dashboardController.getEmployeeStats);
router.get('/financial', dashboardController.getFinancialStats);
router.get('/activities', dashboardController.getRecentActivities);

module.exports = router;