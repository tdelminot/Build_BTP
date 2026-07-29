import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { projectAPI } from '../../../api/project.api';
import { useList } from '../../../hooks/useList';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { SearchBar } from '../../../components/common/SearchBar/SearchBar';
import { Badge } from '../../../components/common/Badge/Badge';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Alert } from '../../../components/common/Alert/Alert';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import './ProjectsList.css';

export const ProjectsList = () => {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({ search: '', status: '' });
  
  const { data: projects, loading, error, refetch } = useList(
    projectAPI.getAll,
    filters
  );

  const columns = [
    { key: 'name', label: 'Nom du projet', width: '20%' },
    { key: 'reference', label: 'Référence', width: '15%' },
    { 
      key: 'status', 
      label: 'Statut', 
      width: '15%',
      render: (value) => (
        <Badge variant={value?.toLowerCase() || 'default'}>
          {value || 'Non défini'}
        </Badge>
      )
    },
    { 
      key: 'budget', 
      label: 'Budget', 
      width: '15%',
      render: (value) => value ? formatCurrency(value) : '-'
    },
    { 
      key: 'progress', 
      label: 'Progression', 
      width: '10%',
      render: (value) => `${value || 0}%`   
    },
    { 
      key: 'startDate', 
      label: 'Date de début', 
      width: '15%',
      render: (value) => value ? formatDate(value) : '-'
    }
  ];

  if (loading) return <Spinner />;
  
  if (error) {
    if (error.response?.status === 401 && !isAuthenticated) {
      return (
        <div className="projects-list-page">
          <div className="page-header">
            <h1>Projets</h1>
          </div>
          <Alert type="info" message="Connectez-vous pour voir vos projets" />
        </div>
      );
    }
    return <div className="error-message">Erreur: {error.message || 'Une erreur est survenue'}</div>;
  }

  return (
    <div className="projects-list-page">
      <div className="page-header">
        <h1>Projets</h1>
        <Link to="/projects/create">
          <Button variant="primary">➕ Ajouter un projet</Button>
        </Link>
      </div>

      <div className="page-toolbar">
        <SearchBar
          placeholder="Rechercher un projet..."
          onSearch={(value) => {
            setFilters({ ...filters, search: value });
            refetch({ search: value });
          }}
        />
      </div>

      <Table
        columns={columns}
        data={Array.isArray(projects) ? projects : []}
        loading={loading}
        onRowClick={(row) => window.location.href = `/projects/${row.id}`}
        emptyMessage={isAuthenticated ? "Aucun projet trouvé" : "Connectez-vous pour voir vos projets"}
      />
    </div>
  );
};