import React, { useEffect, useState } from 'react';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { Button } from '../../common/Button/Button';
import { INVOICE_STATUS } from '../../../utils/constants';
import './InvoiceForm.css';

export const InvoiceForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  clients = [],
  projects = []
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    amount: '',
    taxAmount: '',
    totalAmount: '',
    status: 'DRAFT',
    issueDate: '',
    dueDate: '',
    paymentDate: '',
    description: '',
    clientId: '',
    projectId: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  // useEffect avec dépendance initialData
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être un nombre positif';
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'La date d\'émission est requise';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    } else if (formData.issueDate && new Date(formData.dueDate) <= new Date(formData.issueDate)) {
      newErrors.dueDate = 'La date d\'échéance doit être après la date d\'émission';
    }
    
    if (!formData.clientId) {
      newErrors.clientId = 'Le client est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const amount = parseFloat(formData.amount) || 0;
      const taxAmount = amount * 0.20;
      const totalAmount = amount + taxAmount;
      
      onSubmit({
        ...formData,
        taxAmount,
        totalAmount
      });
    }
  };

  const statusOptions = Object.entries(INVOICE_STATUS).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ')
  }));

  // Vérification que clients/projects sont des tableaux
  const safeClients = Array.isArray(clients) ? clients : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-col">
          <Input
            label="Numéro de facture"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="FAC-2024-001"
            disabled={isEdit}
          />
        </div>
        <div className="form-col">
          <Select
            label="Statut"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            disabled={isEdit && formData.status === 'PAID'}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            error={errors.clientId}
            options={[
              { value: '', label: 'Sélectionner un client...' },
              ...safeClients.map(c => ({ value: c.id, label: c.name }))
            ]}
            required
          />
        </div>
        <div className="form-col">
          <Select
            label="Projet"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Sans projet' },
              ...safeProjects.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <DatePicker
            label="Date d'émission"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            error={errors.issueDate}
            required
          />
        </div>
        <div className="form-col">
          <DatePicker
            label="Date d'échéance"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Montant HT (€)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            required
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="form-col">
          <Input
            label="TVA (20%)"
            name="taxAmount"
            value={formData.taxAmount || parseFloat(formData.amount || 0) * 0.20}
            disabled
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Total TTC (€)"
            name="totalAmount"
            value={formData.totalAmount || (parseFloat(formData.amount || 0) * 1.20)}
            disabled
            placeholder="0.00"
          />
        </div>
        <div className="form-col">
          <DatePicker
            label="Date de paiement"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description de la facture"
          multiline
          rows={2}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Mettre à jour' : 'Créer la facture'}
        </Button>
      </div>
    </form>
  );
};