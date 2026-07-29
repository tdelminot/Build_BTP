import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialAPI } from '../../../api/material.api';
import { supplierAPI } from '../../../api/supplier.api';
import { MaterialForm } from '../../../components/forms/MaterialForm/MaterialForm';
import { Card } from '../../../components/common/Card/Card';
import { Alert } from '../../../components/common/Alert/Alert';
import './MaterialCreate.css';

export const MaterialCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierAPI.getAll();
      setSuppliers(response.data || []);
    } catch (err) {
      console.error('Erreur chargement fournisseurs:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const materialData = {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0,
        minQuantity: parseFloat(formData.minQuantity) || 0,
        unitPrice: parseFloat(formData.unitPrice) || 0
      };

      await materialAPI.create(materialData);
      navigate('/materials');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="material-create-page">
      <div className="page-header">
        <h1>Ajouter un matériel</h1>
        <p className="page-subtitle">Remplissez les informations du nouveau matériel</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <MaterialForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/materials')}
          loading={loading}
          suppliers={suppliers}
        />
      </Card>
    </div>
  );
};