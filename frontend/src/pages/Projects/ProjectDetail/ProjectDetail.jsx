import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectAPI } from '../../../api/project.api';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { Badge } from '../../../components/common/Badge/Badge';
import { formatDate, formatCurrency, getStatusLabel, getStatusColor } from '../../../utils/formatters';
import './ProjectDetail.css';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(id);
      setProject(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du projet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!project) return <Alert type="info" message="Projet non trouvé" />;

  return (
    <div className="project-detail-page">
      <div className="project-detail-header">
        <div>
          <h1>{project.name}</h1>
          <p className="project-reference">Réf: {project.reference}</p>
        </div>
        <div className="project-actions">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            ✏️ Modifier
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                projectAPI.delete(id).then(() => navigate('/projects'));
              }
            }}
          >
            🗑️ Supprimer
          </Button>
        </div>
      </div>

      <div className="project-detail-grid">
        <Card title="Informations générales" className="project-info-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Statut</span>
              <Badge variant={project.status.toLowerCase()}>
                {getStatusLabel(project.status)}
              </Badge>
            </div>
            <div className="info-item">
              <span className="info-label">Progression</span>
              <span className="info-value">{project.progress}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date de début</span>
              <span className="info-value">{formatDate(project.startDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date de fin</span>
              <span className="info-value">{project.endDate ? formatDate(project.endDate) : 'Non définie'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Budget</span>
              <span className="info-value">{formatCurrency(project.budget)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Coût réel</span>
              <span className="info-value">{formatCurrency(project.actualCost)}</span>
            </div>
          </div>
          {project.description && (
            <div className="project-description">
              <h4>Description</h4>
              <p>{project.description}</p>
            </div>
          )}
        </Card>

        <Card title="Équipe" className="project-team-card">
          {project.employees?.length > 0 ? (
            <div className="team-list">
              {project.employees.map((employee) => (
                <div key={employee.id} className="team-member">
                  <span className="member-name">
                    {employee.firstName} {employee.lastName}
                  </span>
                  <span className="member-position">{employee.position}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucun membre dans l'équipe</p>
          )}
        </Card>

        <Card title="Tâches" className="project-tasks-card">
          {project.tasks?.length > 0 ? (
            <div className="task-list">
              {project.tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    <Badge variant={task.status.toLowerCase()}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                  <span className="task-date">
                    {task.dueDate ? formatDate(task.dueDate) : 'Pas de date limite'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucune tâche</p>
          )}
        </Card>

        <Card title="Dépenses" className="project-expenses-card">
          {project.expenses?.length > 0 ? (
            <div className="expense-list">
              {project.expenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                </div>
              ))}
              <div className="expense-total">
                <strong>Total: {formatCurrency(project.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0))}</strong>
              </div>
            </div>
          ) : (
            <p className="empty-message">Aucune dépense</p>
          )}
        </Card>
      </div>
    </div>
  );
};