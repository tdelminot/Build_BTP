import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../../../api/employee.api';
import { useList } from '../../../hooks/useList';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { SearchBar } from '../../../components/common/SearchBar/SearchBar';
import { Badge } from '../../../components/common/Badge/Badge';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { formatDate } from '../../../utils/formatters';
import './EmployeesList.css';

export const EmployeesList = () => {
  const [search, setSearch] = useState('');
  
  //  useList avec options stables
  const { data: employees, loading, error, refetch } = useList(
    employeeAPI.getAll,
    { search }
  );

  const columns = [
    { key: 'firstName', label: 'Prénom', width: '15%' },
    { key: 'lastName', label: 'Nom', width: '15%' },
    { key: 'email', label: 'Email', width: '20%' },
    { key: 'position', label: 'Poste', width: '20%' },
    { 
      key: 'isActive', 
      label: 'Statut', 
      width: '10%',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Actif' : 'Inactif'}
        </Badge>
      )
    },
    {
      key: 'hireDate',
      label: 'Embauché le',
      width: '15%',
      render: (value) => formatDate(value)
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="employees-list-page">
      <div className="page-header">
        <h1>Employés</h1>
        <Link to="/employees/create">
          <Button variant="primary">➕ Ajouter un employé</Button>
        </Link>
      </div>

      <div className="page-toolbar">
        <SearchBar
          placeholder="Rechercher un employé..."
          onSearch={(value) => {
            setSearch(value);
            refetch({ search: value });
          }}
        />
      </div>

      <Table
        columns={columns}
        data={employees}
        loading={loading}
        onRowClick={(row) => window.location.href = `/employees/${row.id}`}
      />
    </div>
  );
};