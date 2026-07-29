import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../../api/report.api';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { DatePicker } from '../../../components/common/DatePicker/DatePicker';
import { Button } from '../../../components/common/Button/Button';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { BarChart } from '../../../components/charts/BarChart/BarChart';
import { PieChart } from '../../../components/charts/PieChart/PieChart';
import './FinancialReport.css';

export const FinancialReport = () => {
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
      
      const response = await reportAPI.getFinancial(params);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return <Alert type="info" message="Aucune donnée disponible" />;

  return (
    <div className="financial-report-page">
      <div className="page-header">
        <h1>Rapport financier</h1>
        <div className="report-controls">
          <DatePicker
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            label="Date de début"
          />
          <DatePicker
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            label="Date de fin"
          />
          <Button variant="primary" onClick={fetchReport}>
            Appliquer
          </Button>
        </div>
      </div>

      <div className="report-summary-grid">
        <Card>
          <div className="summary-item">
            <span className="summary-label">Chiffre d'affaires</span>
            <span className="summary-value revenue">
              {formatCurrency(data.revenue)}
            </span>
          </div>
        </Card>
        <Card>
          <div className="summary-item">
            <span className="summary-label">Dépenses</span>
            <span className="summary-value expenses">
              {formatCurrency(data.expenses)}
            </span>
          </div>
        </Card>
        <Card>
          <div className="summary-item">
            <span className="summary-label">Marge</span>
            <span className="summary-value margin">
              {formatCurrency(data.margin)}
            </span>
          </div>
        </Card>
        <Card>
          <div className="summary-item">
            <span className="summary-label">Taux de marge</span>
            <span className="summary-value margin-rate">
              {data.marginRate}%
            </span>
          </div>
        </Card>
      </div>

      <div className="report-charts-grid">
        <Card title="Répartition des dépenses">
          <PieChart
            data={Object.values(data.expensesByType || {})}
            labels={Object.keys(data.expensesByType || {})}
            height={300}
          />
        </Card>
        <Card title="Évolution des revenus">
          <BarChart
            data={data.revenueByMonth || []}
            labels={data.months || []}
            height={300}
          />
        </Card>
      </div>
    </div>
  );
};