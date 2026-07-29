import React from 'react';
import { invoiceAPI } from '../../../api/invoice.api';
import { useList } from '../../../hooks/useList';
import { Card } from '../../../components/common/Card/Card';
import { Table } from '../../../components/common/Table/Table';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import './PaymentsList.css';

export const PaymentsList = () => {
  //  Utilisation du hook useList
  const { data: invoices, loading, error } = useList(
    invoiceAPI.getAll,
    { limit: 100 }
  );

  // Transformer les factures en paiements
  const payments = React.useMemo(() => {
    const allPayments = (invoices || []).flatMap(inv => 
      (inv.payments || []).map(p => ({
        ...p,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.client?.name
      }))
    );
    return allPayments.sort((a, b) => 
      new Date(b.paymentDate) - new Date(a.paymentDate)
    );
  }, [invoices]);

  const columns = [
    { key: 'invoiceNumber', label: 'Facture', width: '15%' },
    { key: 'clientName', label: 'Client', width: '20%' },
    { 
      key: 'paymentDate', 
      label: 'Date de paiement', 
      width: '15%',
      render: (value) => formatDate(value)
    },
    { key: 'paymentMethod', label: 'Méthode', width: '15%' },
    { 
      key: 'amount', 
      label: 'Montant', 
      width: '15%',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'reference', 
      label: 'Référence', 
      width: '20%',
      render: (value) => value || '-'
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="payments-list-page">
      <div className="page-header">
        <h1>Historique des paiements</h1>
      </div>

      <Card>
        <Table
          columns={columns}
          data={payments}
          loading={loading}
          emptyMessage="Aucun paiement enregistré"
        />
      </Card>
    </div>
  );
};