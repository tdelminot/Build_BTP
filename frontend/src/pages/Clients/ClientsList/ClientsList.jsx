import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { clientAPI } from '../../../api/client.api';
import { useList } from '../../../hooks/useList';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { SearchBar } from '../../../components/common/SearchBar/SearchBar';
import { Badge } from '../../../components/common/Badge/Badge';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import './ClientsList.css';

export const ClientsList = () => {
  const [search, setSearch] = useState('');
  
  // ✅ useList avec options stables
  const { data: clients, loading, error, refetch } = useList(
    clientAPI.getAll,
    { search }
  );

  const columns = [
    { key: 'name', label: 'Nom', width: '25%' },
    { key: 'contactName', label: 'Contact', width: '20%' },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'phone', label: 'Téléphone', width: '15%' },
    { 
      key: 'isActive', 
      label: 'Statut', 
      width: '15%',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="clients-list-page">
      <div className="page-header">
        <h1>Clients</h1>
        <Link to="/clients/create">
          <Button variant="primary">➕ Ajouter un client</Button>
        </Link>
      </div>

      <div className="page-toolbar">
        <SearchBar
          placeholder="Rechercher un client..."
          onSearch={(value) => {
            setSearch(value);
            refetch({ search: value });
          }}
        />
      </div>

      <Table
        columns={columns}
        data={clients}
        loading={loading}
        onRowClick={(row) => window.location.href = `/clients/${row.id}`}
      />
    </div>
  );
};