import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../../api/report.api';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { Button } from '../../../components/common/Button/Button';
import { formatCurrency, formatNumber } from '../../../utils/formatters';
import './GlobalReport.css';

export const GlobalReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await reportAPI.getGlobal(params);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return <Alert type="info" message="Aucune donnée disponible" />;

  return (
    <div className="global-report-page">
      <div className="page-header">
        <h1>Rapport global</h1>
        <div className="report-controls">
          <Button variant="primary" onClick={fetchReport}>
            🔄 Actualiser
          </Button>
        </div>
      </div>

      <div className="report-grid">
        {/* Projets */}
        <Card title="📋 Projets">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{data.projects?.total || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">En cours</span>
            <span className="stat-value">{data.projects?.inProgress || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Terminés</span>
            <span className="stat-value">{data.projects?.completed || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Planifiés</span>
            <span className="stat-value">{data.projects?.planning || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Budget total</span>
            <span className="stat-value">{formatCurrency(data.projects?.totalBudget || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Progression moyenne</span>
            <span className="stat-value">{data.projects?.averageProgress || 0}%</span>
          </div>
        </Card>

        {/* Finances */}
        <Card title="💰 Finances">
          <div className="stat-item">
            <span className="stat-label">Chiffre d'affaires</span>
            <span className="stat-value revenue">{formatCurrency(data.financial?.totalRevenue || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">En attente</span>
            <span className="stat-value pending">{formatCurrency(data.financial?.pendingRevenue || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">En retard</span>
            <span className="stat-value overdue">{formatCurrency(data.financial?.overdueRevenue || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Dépenses</span>
            <span className="stat-value expense">{formatCurrency(data.financial?.totalExpenses || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Bénéfice net</span>
            <span className="stat-value profit">{formatCurrency(data.financial?.netProfit || 0)}</span>
          </div>
        </Card>

        {/* Employés */}
        <Card title="👷 Employés">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{data.employees?.total || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Actifs</span>
            <span className="stat-value">{data.employees?.active || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Inactifs</span>
            <span className="stat-value">{data.employees?.inactive || 0}</span>
          </div>
        </Card>

        {/* Matériels */}
        <Card title="📦 Matériels">
          <div className="stat-item">
            <span className="stat-label">Total articles</span>
            <span className="stat-value">{data.materials?.totalItems || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Valeur totale</span>
            <span className="stat-value">{formatCurrency(data.materials?.totalValue || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Stock bas</span>
            <span className="stat-value alert">{data.materials?.lowStockCount || 0}</span>
          </div>
        </Card>

        {/* Factures */}
        <Card title="📄 Factures" className="report-card-full">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{data.invoices?.total || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Payées</span>
            <span className="stat-value">{data.invoices?.paid || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">En attente</span>
            <span className="stat-value">{data.invoices?.pending || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">En retard</span>
            <span className="stat-value overdue">{data.invoices?.overdue || 0}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};