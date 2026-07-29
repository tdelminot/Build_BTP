import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materialAPI } from '../../../api/material.api';
import { useList } from '../../../hooks/useList';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { SearchBar } from '../../../components/common/SearchBar/SearchBar';
import { Badge } from '../../../components/common/Badge/Badge';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { formatCurrency } from '../../../utils/formatters';
import './MaterialsList.css';

export const MaterialsList = () => {
  const [search, setSearch] = useState('');
  
  //  useList avec options stables
  const { data: materials, loading, error, refetch } = useList(
    materialAPI.getAll,
    { search }
  );

  const columns = [
    { key: 'name', label: 'Nom', width: '20%' },
    { key: 'reference', label: 'Référence', width: '15%' },
    { key: 'category', label: 'Catégorie', width: '15%' },
    { key: 'quantity', label: 'Quantité', width: '10%' },
    { 
      key: 'unitPrice', 
      label: 'Prix unitaire', 
      width: '15%',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'isAvailable', 
      label: 'Disponible', 
      width: '10%',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Oui' : 'Non'}
        </Badge>
      )
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="materials-list-page">
      <div className="page-header">
        <h1>Matériels</h1>
        <Link to="/materials/create">
          <Button variant="primary">➕ Ajouter un matériel</Button>
        </Link>
      </div>

      <div className="page-toolbar">
        <SearchBar
          placeholder="Rechercher un matériel..."
          onSearch={(value) => {
            setSearch(value);
            //  Utiliser refetch pour recharger avec le nouveau filtre
            refetch({ search: value });
          }}
        />
        <Link to="/stock/alerts">
          <Button variant="warning">⚠️ Alertes stock</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        data={materials}
        loading={loading}
        onRowClick={(row) => window.location.href = `/materials/${row.id}`}
      />
    </div>
  );
};