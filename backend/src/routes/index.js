const express = require('express');
const router = express.Router();

// Importer les routes
const authRoutes = require('./v1/auth.routes');
const projectRoutes = require('./v1/project.routes');
const employeeRoutes = require('./v1/employee.routes');
const dashboardRoutes = require('./v1/dashboard.routes');
const materialRoutes = require('./v1/material.routes');
const invoiceRoutes = require('./v1/invoice.routes');
const reportRoutes = require('./v1/report.routes');


const clientRoutes = require('./v1/client.routes');
const supplierRoutes = require('./v1/supplier.routes');
const teamRoutes = require('./v1/team.routes');
const userRoutes = require('./v1/user.routes');
const quoteRoutes = require('./v1/quote.routes');
const taskRoutes = require('./v1/task.routes');
const expenseRoutes = require('./v1/expense.routes');

// Version 1 de l'API
router.use('/v1/auth', authRoutes);
router.use('/v1/projects', projectRoutes);
router.use('/v1/employees', employeeRoutes);
router.use('/v1/dashboard', dashboardRoutes);
router.use('/v1/materials', materialRoutes);
router.use('/v1/invoices', invoiceRoutes);
router.use('/v1/reports', reportRoutes);

//  
router.use('/v1/clients', clientRoutes);
router.use('/v1/suppliers', supplierRoutes);
router.use('/v1/teams', teamRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/quotes', quoteRoutes);
router.use('/v1/tasks', taskRoutes);
router.use('/v1/expenses', expenseRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TIA INFO BUILD API',
    version: '1.0.0'
  });
});

module.exports = router;