import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../../api/client.api';
import { Card } from '../../../components/common/Card/Card';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Alert } from '../../../components/common/Alert/Alert';
import './ClientCreate.css';

export const ClientCreate = () => {
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
    postalCode: '',
    country: '',
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
      await clientAPI.create(formData);
      navigate('/clients');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-create-page">
      <div className="page-header">
        <h1>Ajouter un client</h1>
        <p className="page-subtitle">Remplissez les informations du nouveau client</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <form className="client-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <Input
                label="Nom de l'entreprise"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nom de l'entreprise"
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
                placeholder="contact@entreprise.com"
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
              <Input
                label="Code postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="75001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <Input
                label="Pays"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="France"
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
                Client actif
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/clients')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Créer le client
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};