import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { invoiceAPI } from '../../../api/invoice.api';
import { useList } from '../../../hooks/useList';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { SearchBar } from '../../../components/common/SearchBar/SearchBar';
import { Badge } from '../../../components/common/Badge/Badge';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { formatDate, formatCurrency, getStatusLabel } from '../../../utils/formatters';
import './InvoicesList.css';

export const InvoicesList = () => {
  const [filters, setFilters] = useState({ search: '', status: '' });
  
  //  Utilisation du hook useList
  const { data: invoices, loading, error, refetch } = useList(
    invoiceAPI.getAll,
    filters
  );

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
      key: 'issueDate', 
      label: 'Date d\'émission', 
      width: '15%',
      render: (value) => formatDate(value)
    },
    { 
      key: 'dueDate', 
      label: 'Échéance', 
      width: '15%',
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      label: 'Statut', 
      width: '20%',
      render: (value) => (
        <Badge variant={value.toLowerCase()}>
          {getStatusLabel(value)}
        </Badge>
      )
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="invoices-list-page">
      <div className="page-header">
        <h1>Factures</h1>
        <div className="page-actions">
          <Link to="/invoices/overdue">
            <Button variant="danger">⚠️ Retard</Button>
          </Link>
          <Link to="/invoices/create">
            <Button variant="primary">➕ Créer une facture</Button>
          </Link>
        </div>
      </div>

      <div className="page-toolbar">
        <SearchBar
          placeholder="Rechercher une facture..."
          onSearch={(value) => {
            setFilters({ ...filters, search: value });
            refetch({ search: value });
          }}
        />
      </div>

      <Table
        columns={columns}
        data={invoices}
        loading={loading}
        onRowClick={(row) => window.location.href = `/invoices/${row.id}`}
      />
    </div>
  );
};