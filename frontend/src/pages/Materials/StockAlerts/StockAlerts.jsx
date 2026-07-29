import React, { useState, useEffect } from 'react';
import { materialAPI } from '../../../api/material.api';
import { Card } from '../../../components/common/Card/Card';
import { Table } from '../../../components/common/Table/Table';
import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import './StockAlerts.css';

export const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await materialAPI.getAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Matériel' },
    { key: 'reference', label: 'Référence' },
    { 
      key: 'quantity', 
      label: 'Quantité actuelle',
      render: (value) => (
        <Badge variant="danger">{value}</Badge>
      )
    },
    { 
      key: 'minQuantity', 
      label: 'Quantité minimale',
      render: (value) => <Badge variant="warning">{value}</Badge>
    },
    { 
      key: 'actions', 
      label: 'Action',
      render: (_, row) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => window.location.href = `/stock?material=${row.id}`}
        >
          Réapprovisionner
        </Button>
      )
    }
  ];

  return (
    <div className="stock-alerts-page">
      <div className="page-header">
        <h1>⚠️ Alertes de stock</h1>
        <p className="page-subtitle">Matériels nécessitant un réapprovisionnement</p>
      </div>

      <Card>
        <Table
          columns={columns}
          data={alerts}
          loading={loading}
          emptyMessage="Aucune alerte de stock"
        />
      </Card>
    </div>
  );
};