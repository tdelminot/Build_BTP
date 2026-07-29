import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (requiredRole) => {
    if (!user) return false;

    const roleHierarchy = {
      'ADMIN': 4,
      'MANAGER': 3,
      'SITE_MANAGER': 2,
      'USER': 1
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  const hasAnyPermission = (roles) => {
    return roles.some(role => hasPermission(role));
  };

  return {
    hasPermission,
    hasAnyPermission,
    isAdmin: hasPermission('ADMIN'),
    isManager: hasPermission('MANAGER'),
    isSiteManager: hasPermission('SITE_MANAGER')
  };
};