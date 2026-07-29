import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../../api/employee.api';
import { teamAPI } from '../../../api/team.api';
import { EmployeeForm } from '../../../components/forms/EmployeeForm/EmployeeForm';
import { Card } from '../../../components/common/Card/Card';
import { Alert } from '../../../components/common/Alert/Alert';
import './EmployeeCreate.css';

export const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data || []);
    } catch (err) {
      console.error('Erreur chargement équipes:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const employeeData = {
        ...formData,
        hireDate: new Date(formData.hireDate),
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        hourlyRate: parseFloat(formData.hourlyRate) || 0
      };

      await employeeAPI.create(employeeData);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-create-page">
      <div className="page-header">
        <h1>Ajouter un employé</h1>
        <p className="page-subtitle">Remplissez les informations du nouvel employé</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
          loading={loading}
          teams={teams}
        />
      </Card>
    </div>
  );
};