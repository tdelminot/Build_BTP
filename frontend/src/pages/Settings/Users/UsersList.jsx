import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../api/user.api';
import { Card } from '../../../components/common/Card/Card';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { Badge } from '../../../components/common/Badge/Badge';
import { formatDate } from '../../../utils/formatters';
import './UsersList.css';

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'firstName', label: 'Prénom', width: '15%' },
    { key: 'lastName', label: 'Nom', width: '15%' },
    { key: 'email', label: 'Email', width: '25%' },
    { 
      key: 'role', 
      label: 'Rôle', 
      width: '15%',
      render: (value) => (
        <Badge variant={
          value === 'ADMIN' ? 'danger' :
          value === 'MANAGER' ? 'warning' :
          value === 'SITE_MANAGER' ? 'info' : 'default'
        }>
          {value}
        </Badge>
      )
    },
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
      key: 'lastLogin', 
      label: 'Dernière connexion', 
      width: '20%',
      render: (value) => value ? formatDate(value) : 'Jamais'
    }
  ];

  return (
    <div className="users-list-page">
      <div className="page-header">
        <h1>Utilisateurs</h1>
        <Button variant="primary">➕ Ajouter un utilisateur</Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={users}
          loading={loading}
        />
      </Card>
    </div>
  );
};