import React, { useState } from 'react';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { Button } from '../../common/Button/Button';
import { PAYMENT_METHODS } from '../../../utils/constants';
import './PaymentForm.css';

export const PaymentForm = ({
  invoiceId,
  maxAmount,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'BANK_TRANSFER',
    reference: '',
    notes: '',
    invoiceId
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    const amount = parseFloat(formData.amount);
    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Le montant doit être un nombre positif';
    } else if (amount > maxAmount) {
      newErrors.amount = `Le montant ne peut pas dépasser ${maxAmount}€`;
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'La date de paiement est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const methodOptions = Object.entries(PAYMENT_METHODS).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ')
  }));

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-col">
          <Input
            label="Montant (€)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
            required
            placeholder="0.00"
            step="0.01"
          />
          <small className="form-hint">
            Montant restant à payer : {maxAmount}€
          </small>
        </div>
        <div className="form-col">
          <DatePicker
            label="Date de paiement"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            error={errors.paymentDate}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Select
            label="Méthode de paiement"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={methodOptions}
          />
        </div>
        <div className="form-col">
          <Input
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="N° de chèque, virement, etc."
          />
        </div>
      </div>

      <div className="form-row">
        <Input
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Informations complémentaires"
          multiline
          rows={2}
        />
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="success"
          loading={loading}
        >
          Enregistrer le paiement
        </Button>
      </div>
    </form>
  );
};