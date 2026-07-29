import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Alert } from '../../../components/common/Alert/Alert';
import './ForgotPassword.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel API pour réinitialisation
      // await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <span className="forgot-password-logo">🏗️</span>
          <h1>TIA INFO BUILD</h1>
          <p>Réinitialisation du mot de passe</p>
        </div>

        {success ? (
          <div className="forgot-password-success">
            <Alert
              type="success"
              message="Un email de réinitialisation a été envoyé à votre adresse."
            />
            <Link to="/login" className="back-to-login">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            {error && <Alert type="error" message={error} />}
            
            <p className="forgot-password-description">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Envoyer le lien de réinitialisation
              </Button>
            </form>

            <div className="forgot-password-footer">
              <Link to="/login" className="back-to-login">
                ← Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};