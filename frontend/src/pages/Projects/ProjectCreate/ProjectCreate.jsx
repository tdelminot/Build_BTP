import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../../../api/project.api';
import { employeeAPI } from '../../../api/employee.api';
import { ProjectForm } from '../../../components/forms/ProjectForm/ProjectForm';
import { Card } from '../../../components/common/Card/Card';
import { Alert } from '../../../components/common/Alert/Alert';
import './ProjectCreate.css';

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await employeeAPI.getAll({ limit: 100 });
      setManagers(response.data.employees || []);
    } catch (err) {
      console.error('Erreur chargement managers:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Formater les données
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget),
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      };

      await projectAPI.create(projectData);
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-create-page">
      <div className="page-header">
        <h1>Créer un projet</h1>
        <p className="page-subtitle">Remplissez les informations pour créer un nouveau projet</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/projects')}
          loading={loading}
          managers={managers}
          clients={clients}
        />
      </Card>
    </div>
  );
};