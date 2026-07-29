import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeAPI } from '../../../api/employee.api';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { Badge } from '../../../components/common/Badge/Badge';
import { formatDate, formatCurrency, getInitials } from '../../../utils/formatters';
import './EmployeeDetail.css';

export const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(id);
      setEmployee(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!employee) return <Alert type="info" message="Employé non trouvé" />;

  return (
    <div className="employee-detail-page">
      <div className="employee-detail-header">
        <div className="employee-avatar-large">
          {getInitials(employee.firstName, employee.lastName)}
        </div>
        <div className="employee-header-info">
          <h1>{employee.firstName} {employee.lastName}</h1>
          <p className="employee-position">{employee.position}</p>
          <div className="employee-status">
            <Badge variant={employee.isActive ? 'success' : 'danger'}>
              {employee.isActive ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
        </div>
        <div className="employee-actions">
          <Button
            variant="outline"
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            ✏️ Modifier
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
                employeeAPI.delete(id).then(() => navigate('/employees'));
              }
            }}
          >
            🗑️ Supprimer
          </Button>
        </div>
      </div>

      <div className="employee-detail-grid">
        <Card title="Informations personnelles">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{employee.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{employee.phone || 'Non renseigné'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date d'embauche</span>
              <span className="info-value">{formatDate(employee.hireDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date de naissance</span>
              <span className="info-value">{employee.birthDate ? formatDate(employee.birthDate) : 'Non renseignée'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Taux horaire</span>
              <span className="info-value">{formatCurrency(employee.hourlyRate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Équipe</span>
              <span className="info-value">{employee.team?.name || 'Non assigné'}</span>
            </div>
          </div>
          {employee.address && (
            <div className="employee-address">
              <h4>Adresse</h4>
              <p>{employee.address}</p>
            </div>
          )}
        </Card>

        <Card title="Projets assignés">
          {employee.projects?.length > 0 ? (
            <div className="project-list">
              {employee.projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="project-item">
                  <span className="project-name">{project.name}</span>
                  <Badge variant={project.status.toLowerCase()}>
                    {project.status}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucun projet assigné</p>
          )}
        </Card>

        <Card title="Présences récentes">
          {employee.attendances?.length > 0 ? (
            <div className="attendance-list">
              {employee.attendances.slice(0, 10).map((attendance) => (
                <div key={attendance.id} className="attendance-item">
                  <span className="attendance-date">{formatDate(attendance.date)}</span>
                  <span className="attendance-status">
                    <Badge variant={
                      attendance.status === 'PRESENT' ? 'success' :
                      attendance.status === 'ABSENT' ? 'danger' :
                      attendance.status === 'LATE' ? 'warning' : 'default'
                    }>
                      {attendance.status}
                    </Badge>
                  </span>
                  {attendance.overtimeHours > 0 && (
                    <span className="attendance-overtime">
                      +{attendance.overtimeHours}h
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">Aucune présence enregistrée</p>
          )}
        </Card>

        <Card title="Contacts d'urgence">
          <div className="emergency-info">
            <div className="info-item">
              <span className="info-label">Contact</span>
              <span className="info-value">{employee.emergencyContact || 'Non renseigné'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{employee.emergencyPhone || 'Non renseigné'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};