import React, { useEffect, useState } from 'react';
import { Input } from '../../common/Input/Input';
import { Select } from '../../common/Select/Select';
import { DatePicker } from '../../common/DatePicker/DatePicker';
import { Button } from '../../common/Button/Button';
import './EmployeeForm.css';

export const EmployeeForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
  teams = []
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    hireDate: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    hourlyRate: '',
    teamId: '',
    isActive: true,
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
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.position?.trim()) {
      newErrors.position = 'Le poste est requis';
    }
    
    if (!formData.hireDate) {
      newErrors.hireDate = 'La date d\'embauche est requise';
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

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-col">
          <Input
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            placeholder="Jean"
          />
        </div>
        <div className="form-col">
          <Input
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            placeholder="Dupont"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="jean.dupont@email.com"
          />
        </div>
        <div className="form-col">
          <Input
            label="Téléphone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Poste"
            name="position"
            value={formData.position}
            onChange={handleChange}
            error={errors.position}
            required
            placeholder="Chef de chantier"
          />
        </div>
        <div className="form-col">
          <Select
            label="Équipe"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Sans équipe' },
              ...teams.map(t => ({
                value: t.id,
                label: t.name
              }))
            ]}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <DatePicker
            label="Date d'embauche"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            error={errors.hireDate}
            required
          />
        </div>
        <div className="form-col">
          <DatePicker
            label="Date de naissance"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Taux horaire (€)"
            name="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={handleChange}
            placeholder="25.00"
            step="0.01"
          />
        </div>
        <div className="form-col">
          <Input
            label="Adresse"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Adresse complète"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <Input
            label="Contact d'urgence"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Nom du contact"
          />
        </div>
        <div className="form-col">
          <Input
            label="Téléphone d'urgence"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            placeholder="06 98 76 54 32"
          />
        </div>
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          Actif
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
          {isEdit ? 'Mettre à jour' : 'Ajouter l\'employé'}
        </Button>
      </div>
    </form>
  );
};