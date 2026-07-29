// frontend/src/routes/index.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from '../components/layout/MainLayout/MainLayout';

// Auth
import { Login } from '../pages/Auth/Login/Login';
import { Register } from '../pages/Auth/Register/Register';
import { ForgotPassword } from '../pages/Auth/ForgotPassword/ForgotPassword';

// Dashboard
import { Dashboard } from '../pages/Dashboard/Dashboard';

// Projects
import { ProjectsList } from '../pages/Projects/ProjectsList/ProjectsList';
import { ProjectDetail } from '../pages/Projects/ProjectDetail/ProjectDetail';
import { ProjectCreate } from '../pages/Projects/ProjectCreate/ProjectCreate';
import { ProjectEdit } from '../pages/Projects/ProjectEdit/ProjectEdit';

// Employees
import { EmployeesList } from '../pages/Employees/EmployeesList/EmployeesList';
import { EmployeeDetail } from '../pages/Employees/EmployeeDetail/EmployeeDetail';
import { EmployeeCreate } from '../pages/Employees/EmployeeCreate/EmployeeCreate';
import { Attendance } from '../pages/Employees/Attendance/Attendance';
import { TeamsList } from '../pages/Employees/Teams/TeamsList';

// Materials
import { MaterialsList } from '../pages/Materials/MaterialsList/MaterialsList';
import { MaterialDetail } from '../pages/Materials/MaterialDetail/MaterialDetail';
import { MaterialCreate } from '../pages/Materials/MaterialCreate/MaterialCreate';
import { StockManagement } from '../pages/Materials/StockManagement/StockManagement';
import { StockAlerts } from '../pages/Materials/StockAlerts/StockAlerts';

// Invoices
import { InvoicesList } from '../pages/Invoices/InvoicesList/InvoicesList';
import { InvoiceDetail } from '../pages/Invoices/InvoiceDetail/InvoiceDetail';
import { InvoiceCreate } from '../pages/Invoices/InvoiceCreate/InvoiceCreate';
import { OverdueInvoices } from '../pages/Invoices/OverdueInvoices/OverdueInvoices';
import { PaymentsList } from '../pages/Invoices/Payments/PaymentsList';

// Reports
import { FinancialReport } from '../pages/Reports/FinancialReport/FinancialReport';
import { GlobalReport } from '../pages/Reports/GlobalReport/GlobalReport';

// Clients
import { ClientsList } from '../pages/Clients/ClientsList/ClientsList';
import { ClientDetail } from '../pages/Clients/ClientDetail/ClientDetail';
import { ClientCreate } from '../pages/Clients/ClientCreate/ClientCreate';

// Suppliers
import { SuppliersList } from '../pages/Suppliers/SuppliersList/SuppliersList';
import { SupplierCreate } from '../pages/Suppliers/SupplierCreate/SupplierCreate';

// Settings
import { Profile } from '../pages/Settings/Profile/Profile';
import { UsersList } from '../pages/Settings/Users/UsersList';
import { GeneralSettings } from '../pages/Settings/General/GeneralSettings';

// ✅ UNIQUEMENT PublicRoute
import PublicRoute from './PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: '/register',
    element: <PublicRoute><Register /></PublicRoute>
  },
  {
    path: '/forgot-password',
    element: <PublicRoute><ForgotPassword /></PublicRoute>
  },
  // ✅ TOUTES LES ROUTES SONT PUBLIQUES
  {
    path: '/dashboard',
    element: <MainLayout><Dashboard /></MainLayout>
  },
  {
    path: '/projects',
    element: <MainLayout><ProjectsList /></MainLayout>
  },
  {
    path: '/projects/:id',
    element: <MainLayout><ProjectDetail /></MainLayout>
  },
  {
    path: '/projects/create',
    element: <MainLayout><ProjectCreate /></MainLayout>
  },
  {
    path: '/projects/:id/edit',
    element: <MainLayout><ProjectEdit /></MainLayout>
  },
  {
    path: '/employees',
    element: <MainLayout><EmployeesList /></MainLayout>
  },
  {
    path: '/employees/:id',
    element: <MainLayout><EmployeeDetail /></MainLayout>
  },
  {
    path: '/employees/create',
    element: <MainLayout><EmployeeCreate /></MainLayout>
  },
  {
    path: '/attendance',
    element: <MainLayout><Attendance /></MainLayout>
  },
  {
    path: '/teams',
    element: <MainLayout><TeamsList /></MainLayout>
  },
  {
    path: '/materials',
    element: <MainLayout><MaterialsList /></MainLayout>
  },
  {
    path: '/materials/:id',
    element: <MainLayout><MaterialDetail /></MainLayout>
  },
  {
    path: '/materials/create',
    element: <MainLayout><MaterialCreate /></MainLayout>
  },
  {
    path: '/stock',
    element: <MainLayout><StockManagement /></MainLayout>
  },
  {
    path: '/stock/alerts',
    element: <MainLayout><StockAlerts /></MainLayout>
  },
  {
    path: '/invoices',
    element: <MainLayout><InvoicesList /></MainLayout>
  },
  {
    path: '/invoices/:id',
    element: <MainLayout><InvoiceDetail /></MainLayout>
  },
  {
    path: '/invoices/create',
    element: <MainLayout><InvoiceCreate /></MainLayout>
  },
  {
    path: '/invoices/overdue',
    element: <MainLayout><OverdueInvoices /></MainLayout>
  },
  {
    path: '/payments',
    element: <MainLayout><PaymentsList /></MainLayout>
  },
  {
    path: '/reports/financial',
    element: <MainLayout><FinancialReport /></MainLayout>
  },
  {
    path: '/reports/global',
    element: <MainLayout><GlobalReport /></MainLayout>
  },
  {
    path: '/clients',
    element: <MainLayout><ClientsList /></MainLayout>
  },
  {
    path: '/clients/:id',
    element: <MainLayout><ClientDetail /></MainLayout>
  },
  {
    path: '/clients/create',
    element: <MainLayout><ClientCreate /></MainLayout>
  },
  {
    path: '/suppliers',
    element: <MainLayout><SuppliersList /></MainLayout>
  },
  {
    path: '/suppliers/create',
    element: <MainLayout><SupplierCreate /></MainLayout>
  },
  {
    path: '/settings/profile',
    element: <MainLayout><Profile /></MainLayout>
  },
  {
    path: '/settings/users',
    element: <MainLayout><UsersList /></MainLayout>
  },
  {
    path: '/settings/general',
    element: <MainLayout><GeneralSettings /></MainLayout>
  }
]);

export default router;