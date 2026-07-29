import React, { useState, useEffect } from 'react';
import { materialAPI } from '../../../api/material.api';
import { Card } from '../../../components/common/Card/Card';
import { Table } from '../../../components/common/Table/Table';
import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import { Alert } from '../../../components/common/Alert/Alert';
import { formatCurrency } from '../../../utils/formatters';
import './StockManagement.css';

export const StockManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialAPI.getAll({ limit: 100 });
      setMaterials(response.data.materials || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (operation) => {
    if (!selectedMaterial || !quantity) return;
    try {
      await materialAPI.updateQuantity(selectedMaterial, {
        quantity: parseFloat(quantity),
        operation
      });
      fetchMaterials();
      setQuantity(0);
      setSelectedMaterial(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de mise à jour');
    }
  };

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'reference', label: 'Référence' },
    { key: 'quantity', label: 'Quantité' },
    { key: 'minQuantity', label: 'Min' },
    { 
      key: 'unitPrice', 
      label: 'Prix unitaire',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedMaterial(row.id)}
        >
          Gérer
        </Button>
      )
    }
  ];

  return (
    <div className="stock-management-page">
      <div className="page-header">
        <h1>Gestion des stocks</h1>
      </div>

      {error && <Alert type="error" message={error} />}

      {selectedMaterial && (
        <Card title="Mise à jour du stock" className="stock-update-card">
          <div className="stock-update-controls">
            <Input
              label="Quantité"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              step="0.01"
            />
            <div className="stock-update-actions">
              <Button
                variant="success"
                onClick={() => handleUpdateStock('add')}
              >
                ➕ Ajouter
              </Button>
              <Button
                variant="danger"
                onClick={() => handleUpdateStock('subtract')}
              >
                ➖ Retirer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMaterial(null);
                  setQuantity(0);
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table
          columns={columns}
          data={materials}
          loading={loading}
        />
      </Card>
    </div>
  );
};