import React, { useState } from 'react';
import { Card } from '../../../components/common/Card/Card';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Alert } from '../../../components/common/Alert/Alert';
import './GeneralSettings.css';

export const GeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    companyName: 'TIA INFO BUILD',
    companyEmail: 'contact@tiainfobuild.com',
    companyPhone: '01 23 45 67 89',
    companyAddress: '123 rue de la Construction',
    companyCity: 'Paris',
    companyPostalCode: '75001',
    companyCountry: 'France',
    vatRate: '20'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      // Appel API pour sauvegarder les paramètres
      // await settingsAPI.update(settings);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="general-settings-page">
      <div className="page-header">
        <h1>Paramètres généraux</h1>
        <p className="page-subtitle">Configurez les informations générales de l'application</p>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message="Paramètres sauvegardés avec succès" />}

      <Card>
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Informations de l'entreprise</h3>
            <div className="form-row">
              <div className="form-col">
                <Input
                  label="Nom de l'entreprise"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-col">
                <Input
                  label="Email"
                  name="companyEmail"
                  type="email"
                  value={settings.companyEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <Input
                  label="Téléphone"
                  name="companyPhone"
                  value={settings.companyPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col">
                <Input
                  label="TVA (%)"
                  name="vatRate"
                  type="number"
                  value={settings.vatRate}
                  onChange={handleChange}
                  placeholder="20"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <Input
                  label="Adresse"
                  name="companyAddress"
                  value={settings.companyAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <Input
                  label="Ville"
                  name="companyCity"
                  value={settings.companyCity}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col">
                <Input
                  label="Code postal"
                  name="companyPostalCode"
                  value={settings.companyPostalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <Input
                  label="Pays"
                  name="companyCountry"
                  value={settings.companyCountry}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Sauvegarder les paramètres
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};