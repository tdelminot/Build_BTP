import React, { useState, useEffect } from 'react';
import { invoiceAPI } from '../../../api/invoice.api';
import { Card } from '../../../components/common/Card/Card';
import { Table } from '../../../components/common/Table/Table';
import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import './OverdueInvoices.css';

export const OverdueInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverdueInvoices();
  }, []);

  const fetchOverdueInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getOverdue();
      setInvoices(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'invoiceNumber', label: 'N° Facture', width: '15%' },
    { 
      key: 'client', 
      label: 'Client', 
      width: '20%',
      render: (value) => value?.name || '-'
    },
    { 
      key: 'totalAmount', 
      label: 'Montant', 
      width: '15%',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'dueDate', 
      label: 'Date d\'échéance', 
      width: '15%',
      render: (value) => formatDate(value)
    },
    { 
      key: 'overdueDays', 
      label: 'Jours de retard', 
      width: '15%',
      render: (value) => (
        <Badge variant="danger">{value} jours</Badge>
      )
    },
    { 
      key: 'actions', 
      label: 'Action', 
      width: '20%',
      render: (_, row) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => window.location.href = `/invoices/${row.id}`}
        >
          Voir la facture
        </Button>
      )
    }
  ];

  return (
    <div className="overdue-invoices-page">
      <div className="page-header">
        <h1>⚠️ Factures en retard</h1>
        <p className="page-subtitle">
          {invoices.length} facture(s) en retard de paiement
        </p>
      </div>

      <Card>
        <Table
          columns={columns}
          data={invoices}
          loading={loading}
          emptyMessage="Aucune facture en retard"
        />
      </Card>
    </div>
  );
};