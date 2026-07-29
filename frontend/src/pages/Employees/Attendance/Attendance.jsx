import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../../api/employee.api';
import { Card } from '../../../components/common/Card/Card';
import { Button } from '../../../components/common/Button/Button';
import { Select } from '../../../components/common/Select/Select';
import { DatePicker } from '../../../components/common/DatePicker/DatePicker';
import { Table } from '../../../components/common/Table/Table';
import { Alert } from '../../../components/common/Alert/Alert';
import { formatDate } from '../../../utils/formatters';
import './Attendance.css';

export const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll({ limit: 100 });
      setEmployees(response.data.employees || []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedEmployee) return;
    try {
      setLoading(true);
      const response = await employeeAPI.getAttendance(selectedEmployee, {
        startDate: date,
        endDate: date
      });
      setAttendances(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAttendance = async (status) => {
    try {
      await employeeAPI.recordAttendance({
        employeeId: selectedEmployee,
        date: date,
        status: status
      });
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'enregistrement');
    }
  };

  const columns = [
    { key: 'employeeId', label: 'Employé' },
    { key: 'date', label: 'Date', render: (value) => formatDate(value) },
    { key: 'status', label: 'Statut' },
    { key: 'checkInTime', label: 'Arrivée' },
    { key: 'checkOutTime', label: 'Départ' },
    { key: 'overtimeHours', label: 'Heures sup.' }
  ];

  const employeeOptions = employees.map(e => ({
    value: e.id,
    label: `${e.firstName} ${e.lastName}`
  }));

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h1>Gestion des présences</h1>
      </div>

      <Card>
        <div className="attendance-controls">
          <Select
            label="Employé"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            options={[
              { value: '', label: 'Sélectionner un employé...' },
              ...employeeOptions
            ]}
          />
          <DatePicker
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={fetchAttendance}
            disabled={!selectedEmployee}
          >
            Voir les présences
          </Button>
        </div>

        <div className="attendance-actions">
          <Button
            variant="success"
            onClick={() => handleRecordAttendance('PRESENT')}
            disabled={!selectedEmployee}
          >
            ✅ Présent
          </Button>
          <Button
            variant="danger"
            onClick={() => handleRecordAttendance('ABSENT')}
            disabled={!selectedEmployee}
          >
            ❌ Absent
          </Button>
          <Button
            variant="warning"
            onClick={() => handleRecordAttendance('LATE')}
            disabled={!selectedEmployee}
          >
            ⏰ Retard
          </Button>
        </div>

        {error && <Alert type="error" message={error} />}

        <Table
          columns={columns}
          data={attendances}
          loading={loading}
        />
      </Card>
    </div>
  );
};