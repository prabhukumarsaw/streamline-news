export const PERMISSIONS = {
  // Content Management
  CONTENT_CREATE: 'content.create',
  CONTENT_EDIT: 'content.edit',
  CONTENT_DELETE: 'content.delete',
  CONTENT_PUBLISH: 'content.publish',
  CONTENT_MODERATE: 'content.moderate',
  
  // User Management
  USER_CREATE: 'user.create',
  USER_EDIT: 'user.edit',
  USER_DELETE: 'user.delete',
  USER_VIEW: 'user.view',
  
  // Role Management
  ROLE_CREATE: 'role.create',
  ROLE_EDIT: 'role.edit',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN: 'role.assign',
  
  // System Administration
  SYSTEM_CONFIG: 'system.config',
  SYSTEM_AUDIT: 'system.audit',
  
  // Comments
  COMMENT_MODERATE: 'comment.moderate',
  COMMENT_DELETE: 'comment.delete',
} as const;

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  EDITOR_IN_CHIEF: 'editor_in_chief',
  SENIOR_EDITOR: 'senior_editor',
  AUTHOR: 'author',
  CONTRIBUTOR: 'contributor',
  PUBLIC: 'public',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.EDITOR_IN_CHIEF]: [
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.CONTENT_MODERATE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.ROLE_ASSIGN,
    PERMISSIONS.COMMENT_MODERATE,
    PERMISSIONS.COMMENT_DELETE,
  ],
  [ROLES.SENIOR_EDITOR]: [
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.CONTENT_MODERATE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.COMMENT_MODERATE,
  ],
  [ROLES.AUTHOR]: [
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
  ],
  [ROLES.CONTRIBUTOR]: [
    PERMISSIONS.CONTENT_CREATE,
  ],
  [ROLES.PUBLIC]: [],
};

export function hasPermission(userPermissions: string[] | any, requiredPermission: string): boolean {
  if (Array.isArray(userPermissions)) {
    return userPermissions.includes(requiredPermission);
  }
  
  if (typeof userPermissions === 'object' && userPermissions !== null) {
    return Object.values(userPermissions).flat().includes(requiredPermission);
  }
  
  return false;
}

export function hasAnyPermission(userPermissions: string[] | any, requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission));
}

export function hasAllPermissions(userPermissions: string[] | any, requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission));
}