import React, { useEffect, useState } from 'react';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { Button } from '../../common/Button/Button';
import { PROJECT_STATUS } from '../../../utils/constants';
import './ProjectForm.css';

export const ProjectForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  managers = [],
  clients = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reference: '',
    status: 'PLANNING',
    startDate: '',
    endDate: '',
    budget: '',
    address: '',
    city: '',
    postalCode: '',
    managerId: '',
    clientId: '',
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
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'La date de fin doit être après la date de début';
      }
    }
    
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Le budget doit être un nombre positif';
    }
    
    if (!formData.managerId) {
      newErrors.managerId = 'Le chef de projet est requis';
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

  const statusOptions = Object.entries(PROJECT_STATUS).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ')
  }));

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <Input
          label="Nom du projet"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="ex: Construction Immeuble Résidentiel"
        />
      </div>

      <div className="form-row">
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description détaillée du projet"
          multiline
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-col">
          <Select
            label="Statut"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        </div>
        <div className="form-col">
          <Select
            label="Chef de projet"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            error={errors.managerId}
            options={managers.map(m => ({
              value: m.id,
              label: `${m.firstName} ${m.lastName}`
            }))}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <DatePicker
            label="Date de début"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
          />
        </div>
        <div className="form-col">
          <DatePicker
            label="Date de fin"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Budget (€)"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            error={errors.budget}
            required
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="form-col">
          <Select
            label="Client"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Sélectionner un client...' },
              ...clients.map(c => ({
                value: c.id,
                label: c.name
              }))
            ]}
          />
        </div>
      </div>

      <div className="form-row">
        <Input
          label="Adresse"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Adresse du chantier"
        />
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Ville"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ville"
          />
        </div>
        <div className="form-col">
          <Input
            label="Code postal"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="75001"
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Mettre à jour' : 'Créer le projet'}
        </Button>
      </div>
    </form>
  );
};