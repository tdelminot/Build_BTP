import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierAPI } from '../../../api/supplier.api';
import { Card } from '../../../components/common/Card/Card';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Alert } from '../../../components/common/Alert/Alert';
import './SupplierCreate.css';

export const SupplierCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    siret: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await supplierAPI.create(formData);
      navigate('/suppliers');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplier-create-page">
      <div className="page-header">
        <h1>Ajouter un fournisseur</h1>
        <p className="page-subtitle">Remplissez les informations du nouveau fournisseur</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <form className="supplier-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <Input
                label="Nom du fournisseur"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nom du fournisseur"
              />
            </div>
            <div className="form-col">
              <Input
                label="SIRET"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                placeholder="12345678901234"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Input
                label="Contact principal"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Nom du contact"
              />
            </div>
            <div className="form-col">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contact@fournisseur.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Input
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
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
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ville"
              />
            </div>
            <div className="form-col">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Fournisseur actif
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/suppliers')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Créer le fournisseur
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};