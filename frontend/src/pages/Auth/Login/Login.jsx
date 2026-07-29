import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';
import { Alert } from '../../../components/common/Alert/Alert';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); //  Ajouter isAuthenticated
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  //  Si déjà authentifié, rediriger
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Déjà authentifié, redirection vers dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('📝 1. FORMULAIRE SOUMIS !');
  setError('');
  setLoading(true);

  try {
    console.log('📝 2. Avant login - login function:', login);
    console.log('📤 3. Tentative de connexion avec:', { email: formData.email });
    const response = await login(formData.email, formData.password);
    console.log('✅ 4. Réponse login:', response);
  } catch (err) {
    console.error('❌ 5. Erreur login:', err);
    setError(err.response?.data?.message || 'Erreur de connexion');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-logo">🏗️</span>
          <h1>TIA INFO BUILD</h1>
          <p>Connectez-vous à votre compte</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="login-options">
            <Link to="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Se connecter
          </Button>
        </form>

        <div className="login-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="register-link">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};