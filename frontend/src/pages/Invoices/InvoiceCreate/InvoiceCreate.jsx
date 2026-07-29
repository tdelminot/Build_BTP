import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../../../api/invoice.api';
import { clientAPI } from '../../../api/client.api';
import { projectAPI } from '../../../api/project.api';
import { InvoiceForm } from '../../../components/forms/InvoiceForm/InvoiceForm';
import { Card } from '../../../components/common/Card/Card';
import { Alert } from '../../../components/common/Alert/Alert';
import './InvoiceCreate.css';

export const InvoiceCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, projectsRes] = await Promise.all([
        clientAPI.getAll({ limit: 100 }),
        projectAPI.getAll({ limit: 100 })
      ]);
      setClients(clientsRes.data || []);
      setProjects(projectsRes.data.projects || []);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
        issueDate: new Date(formData.issueDate),
        dueDate: new Date(formData.dueDate),
        paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : null
      };

      await invoiceAPI.create(invoiceData);
      navigate('/invoices');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-create-page">
      <div className="page-header">
        <h1>Créer une facture</h1>
        <p className="page-subtitle">Remplissez les informations pour créer une nouvelle facture</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <InvoiceForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/invoices')}
          loading={loading}
          clients={clients}
          projects={projects}
        />
      </Card>
    </div>
  );
};