import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../../../api/project.api';
import { employeeAPI } from '../../../api/employee.api';
import { ProjectForm } from '../../../components/forms/ProjectForm/ProjectForm';
import { Card } from '../../../components/common/Card/Card';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import './ProjectEdit.css';

export const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [managers, setManagers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, managersRes] = await Promise.all([
        projectAPI.getById(id),
        employeeAPI.getAll({ limit: 100 })
      ]);
      
      setProject(projectRes.data);
      setManagers(managersRes.data.employees || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget),
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      };

      await projectAPI.update(id, projectData);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!project) return <Alert type="info" message="Projet non trouvé" />;

  return (
    <div className="project-edit-page">
      <div className="page-header">
        <h1>Modifier le projet</h1>
        <p className="page-subtitle">Mettez à jour les informations du projet</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <ProjectForm
          initialData={project}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/projects/${id}`)}
          loading={submitting}
          isEdit
          managers={managers}
          clients={clients}
        />
      </Card>
    </div>
  );
};