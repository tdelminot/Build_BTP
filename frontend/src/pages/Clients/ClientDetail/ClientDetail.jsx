import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../../../api/client.api';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { Badge } from '../../../components/common/Badge/Badge';
import { formatCurrency } from '../../../utils/formatters';
import './ClientDetail.css';

export const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getById(id);
      setClient(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!client) return <Alert type="info" message="Client non trouvé" />;

  const totalProjects = client.projects?.length || 0;
  const totalInvoices = client.invoices?.length || 0;
  const totalAmount = client.invoices?.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || 0), 0) || 0;

  return (
    <div className="client-detail-page">
      <div className="client-detail-header">
        <div>
          <h1>{client.name}</h1>
          {client.siret && (
            <p className="client-siret">SIRET: {client.siret}</p>
          )}
        </div>
        <div className="client-actions">
          <Badge variant={client.isActive ? 'success' : 'danger'}>
            {client.isActive ? 'Actif' : 'Inactif'}
          </Badge>
          <Button
            variant="outline"
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            ✏️ Modifier
          </Button>
        </div>
      </div>

      <div className="client-stats">
        <Card>
          <div className="stat-item">
            <span className="stat-label">Projets</span>
            <span className="stat-value">{totalProjects}</span>
          </div>
        </Card>
        <Card>
          <div className="stat-item">
            <span className="stat-label">Factures</span>
            <span className="stat-value">{totalInvoices}</span>
          </div>
        </Card>
        <Card>
          <div className="stat-item">
            <span className="stat-label">Montant total</span>
            <span className="stat-value">{formatCurrency(totalAmount)}</span>
          </div>
        </Card>
      </div>

      <div className="client-detail-grid">
        <Card title="Informations de contact">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <span className="contact-value">{client.email}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Téléphone</span>
              <span className="contact-value">{client.phone || 'Non renseigné'}</span>
            </div>
            {client.contactName && (
              <div className="contact-item">
                <span className="contact-label">Contact principal</span>
                <span className="contact-value">{client.contactName}</span>
              </div>
            )}
            {client.address && (
              <div className="contact-item">
                <span className="contact-label">Adresse</span>
                <span className="contact-value">
                  {client.address}
                  {client.city && `, ${client.city}`}
                  {client.postalCode && ` ${client.postalCode}`}
                  {client.country && `, ${client.country}`}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Projets récents">
          {client.projects?.length > 0 ? (
            <div className="project-list">
              {client.projects.slice(0, 5).map((project) => (
                <div key={project.id} className="project-item">
                  <span className="project-name">{project.name}</span>
                  <Badge variant={project.status?.toLowerCase()}>
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucun projet</p>
          )}
        </Card>
      </div>
    </div>
  );
};