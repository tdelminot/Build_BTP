import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../../../components/common/Card/Card';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Alert } from '../../../components/common/Alert/Alert';
import './Profile.css';

export const Profile = () => {
  const { user, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      await changePassword(formData.oldPassword, formData.newPassword);
      setSuccess(true);
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Mon profil</h1>
        <p className="page-subtitle">Gérez vos informations personnelles</p>
      </div>

      <div className="profile-grid">
        <Card title="Informations personnelles">
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="profile-details">
              <p><strong>Nom :</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email :</strong> {user?.email}</p>
              <p><strong>Rôle :</strong> {user?.role}</p>
            </div>
          </div>
        </Card>

        <Card title="Changer le mot de passe">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message="Mot de passe modifié avec succès" />}

          <form className="password-form" onSubmit={handleSubmit}>
            <Input
              label="Mot de passe actuel"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="Nouveau mot de passe"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Changer le mot de passe
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};