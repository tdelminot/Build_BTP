import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../../../api/invoice.api';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { Badge } from '../../../components/common/Badge/Badge';
import { formatDate, formatCurrency, getStatusLabel } from '../../../utils/formatters';
import { PaymentForm } from '../../../components/forms/PaymentForm/PaymentForm';
import { Modal } from '../../../components/common/Modal/Modal';
import './InvoiceDetail.css';

export const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getById(id);
      setInvoice(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      setPaymentLoading(true);
      await invoiceAPI.recordPayment(id, paymentData);
      setShowPaymentModal(false);
      fetchInvoice();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement du paiement');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    try {
      await invoiceAPI.send(id);
      fetchInvoice();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!invoice) return <Alert type="info" message="Facture non trouvée" />;

  const remainingAmount = invoice.totalAmount - (invoice.paidAmount || 0);

  return (
    <div className="invoice-detail-page">
      <div className="invoice-detail-header">
        <div>
          <h1>Facture {invoice.invoiceNumber}</h1>
          <p className="invoice-reference">
            Émise le {formatDate(invoice.issueDate)}
          </p>
        </div>
        <div className="invoice-actions">
          <Badge variant={invoice.status.toLowerCase()}>
            {getStatusLabel(invoice.status)}
          </Badge>
          {invoice.status === 'DRAFT' && (
            <Button variant="primary" onClick={handleSendInvoice}>
              📤 Envoyer
            </Button>
          )}
          {invoice.status !== 'PAID' && (
            <Button 
              variant="success" 
              onClick={() => setShowPaymentModal(true)}
            >
              💳 Enregistrer un paiement
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/invoices/${id}/edit`)}
          >
            ✏️ Modifier
          </Button>
        </div>
      </div>

      <div className="invoice-detail-grid">
        <Card title="Informations" className="invoice-info-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Client</span>
              <span className="info-value">{invoice.client?.name || 'Non spécifié'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Projet</span>
              <span className="info-value">{invoice.project?.name || 'Non spécifié'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date d'échéance</span>
              <span className="info-value">{formatDate(invoice.dueDate)}</span>
            </div>
            {invoice.paymentDate && (
              <div className="info-item">
                <span className="info-label">Date de paiement</span>
                <span className="info-value">{formatDate(invoice.paymentDate)}</span>
              </div>
            )}
          </div>
          {invoice.description && (
            <div className="invoice-description">
              <h4>Description</h4>
              <p>{invoice.description}</p>
            </div>
          )}
        </Card>

        <Card title="Montants" className="invoice-amounts-card">
          <div className="amounts-grid">
            <div className="amount-item">
              <span className="amount-label">Montant HT</span>
              <span className="amount-value">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="amount-item">
              <span className="amount-label">TVA (20%)</span>
              <span className="amount-value">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="amount-item total">
              <span className="amount-label">Total TTC</span>
              <span className="amount-value">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <div className="amount-item paid">
                <span className="amount-label">Montant payé</span>
                <span className="amount-value">{formatCurrency(invoice.paidAmount)}</span>
              </div>
            )}
            {remainingAmount > 0 && (
              <div className="amount-item remaining">
                <span className="amount-label">Reste à payer</span>
                <span className="amount-value">{formatCurrency(remainingAmount)}</span>
              </div>
            )}
          </div>
        </Card>

        {invoice.payments && invoice.payments.length > 0 && (
          <Card title="Historique des paiements" className="payments-card">
            <div className="payments-list">
              {invoice.payments.map((payment) => (
                <div key={payment.id} className="payment-item">
                  <div className="payment-info">
                    <span className="payment-date">{formatDate(payment.paymentDate)}</span>
                    <span className="payment-method">{payment.paymentMethod}</span>
                  </div>
                  <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Enregistrer un paiement"
        size="md"
      >
        <PaymentForm
          invoiceId={id}
          maxAmount={remainingAmount}
          onSubmit={handlePayment}
          onCancel={() => setShowPaymentModal(false)}
          loading={paymentLoading}
        />
      </Modal>
    </div>
  );
};