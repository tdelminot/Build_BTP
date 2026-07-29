import { ROLES } from './constants';

// Hiérarchie des rôles
const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 4,
  [ROLES.MANAGER]: 3,
  [ROLES.SITE_MANAGER]: 2,
  [ROLES.USER]: 1
};

// Vérifier si un utilisateur a un rôle spécifique
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role;
};

// Vérifier si un utilisateur a au moins un des rôles spécifiés
export const hasAnyRole = (user, roles) => {
  if (!user || !roles || roles.length === 0) return false;
  return roles.includes(user.role);
};

// Vérifier si un utilisateur a un niveau de permission suffisant
export const hasPermission = (user, requiredRole) => {
  if (!user) return false;
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

// Vérifier si un utilisateur a les permissions pour une action
export const can = (user, action) => {
  if (!user) return false;

  const permissions = {
    // Actions admin
    'delete_user': [ROLES.ADMIN],
    'manage_users': [ROLES.ADMIN, ROLES.MANAGER],
    'manage_settings': [ROLES.ADMIN],
    
    // Actions projets
    'create_project': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_project': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_project': [ROLES.ADMIN],
    'view_project': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER, ROLES.USER],
    'manage_project_team': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    
    // Actions employés
    'create_employee': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_employee': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_employee': [ROLES.ADMIN],
    'view_employee': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    'manage_attendance': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    
    // Actions matériels
    'create_material': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_material': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_material': [ROLES.ADMIN],
    'view_material': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    'manage_stock': [ROLES.ADMIN, ROLES.MANAGER],
    
    // Actions factures
    'create_invoice': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_invoice': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_invoice': [ROLES.ADMIN],
    'view_invoice': [ROLES.ADMIN, ROLES.MANAGER],
    'record_payment': [ROLES.ADMIN, ROLES.MANAGER],
    
    // Actions rapports
    'view_reports': [ROLES.ADMIN, ROLES.MANAGER],
    'export_reports': [ROLES.ADMIN, ROLES.MANAGER],
    
    // Actions clients
    'manage_clients': [ROLES.ADMIN, ROLES.MANAGER],
    'view_clients': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    
    // Actions fournisseurs
    'manage_suppliers': [ROLES.ADMIN, ROLES.MANAGER],
    'view_suppliers': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]
  };

  const allowedRoles = permissions[action];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(user.role);
};

// Obtenir toutes les permissions d'un utilisateur
export const getUserPermissions = (user) => {
  if (!user) return [];
  
  const allPermissions = Object.entries({
    // Admin
    'delete_user': [ROLES.ADMIN],
    'manage_users': [ROLES.ADMIN, ROLES.MANAGER],
    'manage_settings': [ROLES.ADMIN],
    
    // Projets
    'create_project': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_project': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_project': [ROLES.ADMIN],
    'view_project': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER, ROLES.USER],
    'manage_project_team': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    
    // Employés
    'create_employee': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_employee': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_employee': [ROLES.ADMIN],
    'view_employee': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    'manage_attendance': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    
    // Matériels
    'create_material': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_material': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_material': [ROLES.ADMIN],
    'view_material': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    'manage_stock': [ROLES.ADMIN, ROLES.MANAGER],
    
    // Factures
    'create_invoice': [ROLES.ADMIN, ROLES.MANAGER],
    'edit_invoice': [ROLES.ADMIN, ROLES.MANAGER],
    'delete_invoice': [ROLES.ADMIN],
    'view_invoice': [ROLES.ADMIN, ROLES.MANAGER],
    'record_payment': [ROLES.ADMIN, ROLES.MANAGER],
    
    // Rapports
    'view_reports': [ROLES.ADMIN, ROLES.MANAGER],
    'export_reports': [ROLES.ADMIN, ROLES.MANAGER],
    
    // Clients
    'manage_clients': [ROLES.ADMIN, ROLES.MANAGER],
    'view_clients': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER],
    
    // Fournisseurs
    'manage_suppliers': [ROLES.ADMIN, ROLES.MANAGER],
    'view_suppliers': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SITE_MANAGER]
  });

  return allPermissions
    .filter(([_, roles]) => roles.includes(user.role))
    .map(([permission]) => permission);
};