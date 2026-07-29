import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { materialAPI } from '../../../api/material.api';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { Badge } from '../../../components/common/Badge/Badge';
import { formatCurrency } from '../../../utils/formatters';
import './MaterialDetail.css';

export const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const response = await materialAPI.getById(id);
      setMaterial(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!material) return <Alert type="info" message="Matériel non trouvé" />;

  const isLowStock = material.quantity <= material.minQuantity;

  return (
    <div className="material-detail-page">
      <div className="material-detail-header">
        <div>
          <h1>{material.name}</h1>
          <p className="material-reference">Réf: {material.reference}</p>
        </div>
        <div className="material-actions">
          <Badge variant={material.isAvailable ? 'success' : 'danger'}>
            {material.isAvailable ? 'Disponible' : 'Indisponible'}
          </Badge>
          {isLowStock && (
            <Badge variant="danger">⚠️ Stock bas</Badge>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/materials/${id}/edit`)}
          >
            ✏️ Modifier
          </Button>
        </div>
      </div>

      <div className="material-detail-grid">
        <Card title="Informations">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Catégorie</span>
              <span className="info-value">{material.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Unité</span>
              <span className="info-value">{material.unit}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quantité</span>
              <span className={`info-value ${isLowStock ? 'text-danger' : ''}`}>
                {material.quantity}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Quantité minimale</span>
              <span className="info-value">{material.minQuantity}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Prix unitaire</span>
              <span className="info-value">{formatCurrency(material.unitPrice)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fournisseur</span>
              <span className="info-value">{material.supplier?.name || 'Non spécifié'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Emplacement</span>
              <span className="info-value">{material.location || 'Non spécifié'}</span>
            </div>
          </div>
          {material.description && (
            <div className="material-description">
              <h4>Description</h4>
              <p>{material.description}</p>
            </div>
          )}
        </Card>

        <Card title="Projets associés">
          {material.projects?.length > 0 ? (
            <div className="project-list">
              {material.projects.map((project) => (
                <div key={project.id} className="project-item">
                  <span className="project-name">{project.name}</span>
                  <span className="project-quantity">
                    Quantité: {project.ProjectMaterial?.quantity || 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucun projet associé</p>
          )}
        </Card>
      </div>
    </div>
  );
};