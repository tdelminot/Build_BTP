 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  
import { useAuth } from '../../hooks/useAuth';
import { dashboardAPI } from '../../api/dashboard.api';
import KPIWidget from "./components/KPIWidget/KPIWidget";
import ProjectChart from "./components/ProjectChart/ProjectChart";
import FinancialSummary from "./components/FinancialSummary/FinancialSummary";
import ProjectStatus from "./components/ProjectStatus/ProjectStatus";
import RecentActivities from "./components/RecentActivities/RecentActivities";
import { Spinner } from '../../components/common/Spinner/Spinner';
import { Alert } from '../../components/common/Alert/Alert';
import './Dashboard.css';

export const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    projects: {
      total: 0,
      inProgress: 0,
      completed: 0,
      planning: 0,
      onHold: 0,
      change: 0
    },
    employees: {
      total: 0,
      active: 0
    },
    financial: {
      totalRevenue: 0,
      pendingRevenue: 0,
      overdueRevenue: 0,
      totalExpenses: 0,
      netProfit: 0
    },
    recentProjects: [],
    recentActivities: []
  });

  useEffect(() => {
    // ✅ Si connecté, charger les données
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      // ✅ Si non connecté, afficher le dashboard avec des données vides
      setLoading(false);
      console.log('📊 Dashboard - Non connecté, affichage public sans données');
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboard();
      
      const responseData = response.data.data || response.data;
      
      setData({
        projects: {
          total: responseData.projects?.total || 0,
          inProgress: responseData.projects?.inProgress || 0,
          completed: responseData.projects?.completed || 0,
          planning: responseData.projects?.planning || 0,
          onHold: responseData.projects?.onHold || 0,
          change: responseData.projects?.change || 0
        },
        employees: {
          total: responseData.employees?.total || 0,
          active: responseData.employees?.active || 0
        },
        financial: {
          totalRevenue: responseData.financial?.totalRevenue || 0,
          pendingRevenue: responseData.financial?.pendingRevenue || 0,
          overdueRevenue: responseData.financial?.overdueRevenue || 0,
          totalExpenses: responseData.financial?.totalExpenses || 0,
          netProfit: responseData.financial?.netProfit || 0
        },
        recentProjects: responseData.recentProjects || [],
        recentActivities: responseData.recentActivities || []
      });
      
      setError(null);
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      // ✅ Si 401, ne pas afficher d'erreur (on est pas connecté)
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner size="lg" />
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">
            Vue d'ensemble de votre activité BTP
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button 
            className="dashboard-refresh" 
            onClick={fetchDashboardData}
            disabled={!isAuthenticated}
          >
            🔄 Actualiser
          </button>
          <Link to="/login" className="dashboard-login-btn">
            🔑 Connexion
          </Link>
        </div>
      </div>

      <div className="dashboard-kpis">
        <KPIWidget
          title="Projets en cours"
          value={data.projects.inProgress || 0}
          icon="📋"
          color="#2563eb"
          change={data.projects.change || 0}
        />
        <KPIWidget
          title="Employés actifs"
          value={data.employees.active || 0}
          icon="👷"
          color="#22c55e"
        />
        <KPIWidget
          title="Chiffre d'affaires"
          value={data.financial.totalRevenue || 0}
          icon="💰"
          color="#eab308"
          format="currency"
        />
        <KPIWidget
          title="Marge nette"
          value={data.financial.netProfit || 0}
          icon="📈"
          color="#8b5cf6"
          format="currency"
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Avancement des projets</h3>
          <ProjectChart projects={data.recentProjects} />
        </div>
        <div className="chart-card">
          <h3>Résumé financier</h3>
          <FinancialSummary financial={data.financial} />
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="status-card">
          <h3>Statut des projets</h3>
          <ProjectStatus status={data.projects} />
        </div>
        <div className="activities-card">
          <h3>Activités récentes</h3>
          <RecentActivities activities={data.recentActivities} />
        </div>
      </div>
    </div>
  );
};       