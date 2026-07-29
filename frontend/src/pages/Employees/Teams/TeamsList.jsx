import React, { useState } from 'react';
import { teamAPI } from '../../../api/team.api';
import { useList } from '../../../hooks/useList';
import { Card } from '../../../components/common/Card/Card';
import { Button } from '../../../components/common/Button/Button';
import { Table } from '../../../components/common/Table/Table';
import { Spinner } from '../../../components/common/Spinner/Spinner';
import { Badge } from '../../../components/common/Badge/Badge';
import './TeamsList.css';

export const TeamsList = () => {
  //  Utilisation du hook useList
  const { data: teams, loading, error } = useList(teamAPI.getAll);

  const columns = [
    { key: 'name', label: 'Nom de l\'équipe', width: '30%' },
    { key: 'description', label: 'Description', width: '40%' },
    { 
      key: 'members', 
      label: 'Membres', 
      width: '30%',
      render: (value, row) => (
        <div className="team-members">
          {row.members?.map(m => (
            <Badge key={m.id} variant="default" size="sm">
              {m.firstName} {m.lastName}
            </Badge>
          ))}
        </div>
      )
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="teams-list-page">
      <div className="page-header">
        <h1>Équipes</h1>
        <Button variant="primary">➕ Créer une équipe</Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={teams}
          loading={loading}
        />
      </Card>
    </div>
  );
};