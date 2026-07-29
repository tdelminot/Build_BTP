import { format, formatDistance, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formatage des dates
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '-';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm');
  } catch {
    return '-';
  }
};

export const formatRelativeTime = (date) => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: fr });
  } catch {
    return '-';
  }
};

// Formatage des nombres
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

export const formatCurrency = (amount, currency = 'EUR') => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-';
  return `${formatNumber(value * 100, decimals)}%`;
};

// Formatage des textes
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '?';
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

// Formatage des statuts
export const getStatusColor = (status) => {
  const colors = {
    // Projet
    'PLANNING': '#3b82f6',
    'IN_PROGRESS': '#22c55e',
    'ON_HOLD': '#eab308',
    'COMPLETED': '#8b5cf6',
    'CANCELLED': '#ef4444',
    
    // Facture
    'DRAFT': '#64748b',
    'SENT': '#3b82f6',
    'PAID': '#22c55e',
    'OVERDUE': '#ef4444',
    
    // Tâche
    'TODO': '#64748b',
    'BLOCKED': '#ef4444',
    
    // Priorité
    'LOW': '#22c55e',
    'MEDIUM': '#eab308',
    'HIGH': '#f97316',
    'URGENT': '#ef4444'
  };
  return colors[status] || '#64748b';
};

export const getStatusLabel = (status) => {
  const labels = {
    // Projet
    'PLANNING': 'Planification',
    'IN_PROGRESS': 'En cours',
    'ON_HOLD': 'En pause',
    'COMPLETED': 'Terminé',
    'CANCELLED': 'Annulé',
    
    // Facture
    'DRAFT': 'Brouillon',
    'SENT': 'Envoyée',
    'PAID': 'Payée',
    'OVERDUE': 'En retard',
    
    // Tâche
    'TODO': 'À faire',
    'BLOCKED': 'Bloquée',
    
    // Priorité
    'LOW': 'Basse',
    'MEDIUM': 'Moyenne',
    'HIGH': 'Haute',
    'URGENT': 'Urgente'
  };
  return labels[status] || status;
};