import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supplierAPI } from '../../../api/supplier.api';
import { useList } from '../../../hooks/useList';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { SearchBar } from '../../../components/common/SearchBar/SearchBar';
import { Badge } from '../../../components/common/Badge/Badge';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import './SuppliersList.css';

export const SuppliersList = () => {
  const [search, setSearch] = useState('');
  
  //  useList avec options stables
  const { data: suppliers, loading, error, refetch } = useList(
    supplierAPI.getAll,
    { search }
  );

  const columns = [
    { key: 'name', label: 'Nom', width: '30%' },
    { key: 'contactName', label: 'Contact', width: '25%' },
    { key: 'email', label: 'Email', width: '30%' },
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
    <div className="suppliers-list-page">
      <div className="page-header">
        <h1>Fournisseurs</h1>
        <Link to="/suppliers/create">
          <Button variant="primary">➕ Ajouter un fournisseur</Button>
        </Link>
      </div>

      <div className="page-toolbar">
        <SearchBar
          placeholder="Rechercher un fournisseur..."
          onSearch={(value) => {
            setSearch(value);
            refetch({ search: value });
          }}
        />
      </div>

      <Table
        columns={columns}
        data={suppliers}
        loading={loading}
        onRowClick={(row) => window.location.href = `/suppliers/${row.id}`}
      />
    </div>
  );
};