import { ROLES } from '../utils/constants';

export const routeConfig = {
  public: [
    { path: '/login' },
    { path: '/register' },
    { path: '/forgot-password' }
  ],
  private: {
    [ROLES.ADMIN]: {
      paths: [
        '/dashboard',
        '/projects/*',
        '/employees/*',
        '/materials/*',
        '/invoices/*',
        '/reports/*',
        '/clients/*',
        '/suppliers/*',
        '/settings/*'
      ]
    },
    [ROLES.MANAGER]: {
      paths: [
        '/dashboard',
        '/projects/*',
        '/employees/*',
        '/materials/*',
        '/invoices/*',
        '/reports/*',
        '/clients/*',
        '/suppliers/*'
      ]
    },
    [ROLES.SITE_MANAGER]: {
      paths: [
        '/dashboard',
        '/projects/:id',
        '/employees/*',
        '/materials/*',
        '/attendance'
      ]
    },
    [ROLES.USER]: {
      paths: [
        '/dashboard',
        '/projects/:id',
        '/attendance'
      ]
    }
  }
};

export const getRoutePermissions = (role) => {
  return routeConfig.private[role]?.paths || [];
};

export const hasRoutePermission = (role, path) => {
  const allowedPaths = getRoutePermissions(role);
  return allowedPaths.some(allowedPath => {
    const pattern = allowedPath.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
};