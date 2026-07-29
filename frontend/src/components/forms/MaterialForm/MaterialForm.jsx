import React, { useEffect, useState } from 'react';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { Button } from '../../common/Button/Button';
import { UNITS } from '../../../utils/constants';
import './MaterialForm.css';

export const MaterialForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  suppliers = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    description: '',
    category: '',
    unit: 'UNIT',
    quantity: '',
    minQuantity: '',
    unitPrice: '',
    supplierId: '',
    location: '',
    isAvailable: true,
    ...initialData
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Le nom du matériel est requis';
    }
    
    if (!formData.reference?.trim()) {
      newErrors.reference = 'La référence est requise';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'La catégorie est requise';
    }
    
    if (formData.quantity && parseFloat(formData.quantity) < 0) {
      newErrors.quantity = 'La quantité doit être positive';
    }
    
    if (formData.minQuantity && parseFloat(formData.minQuantity) < 0) {
      newErrors.minQuantity = 'La quantité minimale doit être positive';
    }
    
    if (formData.unitPrice && parseFloat(formData.unitPrice) < 0) {
      newErrors.unitPrice = 'Le prix unitaire doit être positif';
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

  const unitOptions = Object.entries(UNITS).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ')
  }));

  return (
    <form className="material-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-col">
          <Input
            label="Nom du matériel"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="ex: Ciment, Acier, etc."
          />
        </div>
        <div className="form-col">
          <Input
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            error={errors.reference}
            required
            placeholder="REF-001"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Catégorie"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            required
            placeholder="ex: Matériaux, Outillage, etc."
          />
        </div>
        <div className="form-col">
          <Select
            label="Unité"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            options={unitOptions}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Quantité"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
            placeholder="0"
            step="0.01"
          />
        </div>
        <div className="form-col">
          <Input
            label="Quantité minimale"
            name="minQuantity"
            type="number"
            value={formData.minQuantity}
            onChange={handleChange}
            error={errors.minQuantity}
            placeholder="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Prix unitaire (€)"
            name="unitPrice"
            type="number"
            value={formData.unitPrice}
            onChange={handleChange}
            error={errors.unitPrice}
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="form-col">
          <Select
            label="Fournisseur"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Sélectionner un fournisseur...' },
              ...suppliers.map(s => ({
                value: s.id,
                label: s.name
              }))
            ]}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Emplacement"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Entrepôt A, Étagère 3"
          />
        </div>
        <div className="form-col">
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du matériel"
            multiline
            rows={2}
          />
        </div>
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          Disponible
        </label>
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
          variant="primary"
          loading={loading}
        >
          {isEdit ? 'Mettre à jour' : 'Ajouter le matériel'}
        </Button>
      </div>
    </form>
  );
};