// Role-Based Access Control utilities

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  username: string
}

// Permission definitions
export const PERMISSIONS = {
  // Post permissions
  POST_CREATE: 'post:create',
  POST_READ: 'post:read',
  POST_UPDATE: 'post:update',
  POST_DELETE: 'post:delete',
  POST_PUBLISH: 'post:publish',

  // User permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Media permissions
  MEDIA_UPLOAD: 'media:upload',
  MEDIA_DELETE: 'media:delete',
  MEDIA_MANAGE: 'media:manage',

  // Analytics permissions
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',

  // Settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',

  // System permissions
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_EXPORT: 'system:export',
  SYSTEM_MAINTENANCE: 'system:maintenance',
} as const

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],
  admin: [
    // All permissions
    ...Object.values(PERMISSIONS),
  ],
  editor: [
    PERMISSIONS.POST_CREATE,
    PERMISSIONS.POST_READ,
    PERMISSIONS.POST_UPDATE,
    PERMISSIONS.POST_PUBLISH,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.MEDIA_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  author: [
    PERMISSIONS.POST_CREATE,
    PERMISSIONS.POST_READ,
    PERMISSIONS.POST_UPDATE,
    PERMISSIONS.MEDIA_UPLOAD,
  ],
  user: [
    PERMISSIONS.POST_READ,
  ],
}

// Check if user has permission
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false

  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return userPermissions.includes(permission)
}

// Check if user has any of the permissions
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user) return false

  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return permissions.some(permission => userPermissions.includes(permission))
}

// Check if user has all permissions
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  if (!user) return false

  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return permissions.every(permission => userPermissions.includes(permission))
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || []
}

// Check if user can access admin panel
export function canAccessAdmin(user: User | null): boolean {
  if (!user) return false

  const adminRoles: UserRole[] = ['super_admin', 'admin', 'editor']
  return adminRoles.includes(user.role)
}

// Check if user can manage users
export function canManageUsers(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.USER_CREATE)
}

// Check if user can publish posts
export function canPublishPosts(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.POST_PUBLISH)
}

// Check if user can delete posts
export function canDeletePosts(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.POST_DELETE)
}

// Check if user can manage media
export function canManageMedia(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.MEDIA_MANAGE)
}

// Check if user can view analytics
export function canViewAnalytics(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.ANALYTICS_VIEW)
}

// Check if user can update settings
export function canUpdateSettings(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SETTINGS_UPDATE)
}

// Get user's role hierarchy level (higher number = more permissions)
export function getRoleLevel(role: UserRole): number {
  const levels: Record<UserRole, number> = {
    user: 1,
    author: 2,
    editor: 3,
    admin: 4,
    super_admin: 5,
  }
  return levels[role] || 0
}

// Check if user role is higher than or equal to required role
export function hasRoleLevel(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false

  return getRoleLevel(user.role) >= getRoleLevel(requiredRole)
}

// Get navigation items based on user permissions
export function getAllowedNavItems(user: User | null) {
  if (!user) return []

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'HomeIcon',
      permission: PERMISSIONS.POST_READ,
    },
    {
      name: 'Posts',
      href: '/admin/posts',
      icon: 'DocumentTextIcon',
      permission: PERMISSIONS.POST_READ,
    },
    {
      name: 'Media',
      href: '/admin/media',
      icon: 'PhotoIcon',
      permission: PERMISSIONS.MEDIA_UPLOAD,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: 'ChartBarIcon',
      permission: PERMISSIONS.ANALYTICS_VIEW,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: 'UserGroupIcon',
      permission: PERMISSIONS.USER_READ,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: 'CogIcon',
      permission: PERMISSIONS.SETTINGS_VIEW,
    },
  ]

  return navItems.filter(item => hasPermission(user, item.permission))
}

// Get available actions for a post based on user permissions
export function getPostActions(user: User | null, postStatus: string) {
  const actions = []

  if (hasPermission(user, PERMISSIONS.POST_UPDATE)) {
    actions.push('edit')
  }

  if (hasPermission(user, PERMISSIONS.POST_DELETE)) {
    actions.push('delete')
  }

  if (hasPermission(user, PERMISSIONS.POST_PUBLISH) && postStatus === 'draft') {
    actions.push('publish')
  }

  if (postStatus === 'published') {
    actions.push('unpublish')
  }

  return actions
}

// Get available actions for media based on user permissions
export function getMediaActions(user: User | null) {
  const actions = ['view']

  if (hasPermission(user, PERMISSIONS.MEDIA_UPLOAD)) {
    actions.push('upload')
  }

  if (hasPermission(user, PERMISSIONS.MEDIA_DELETE)) {
    actions.push('delete')
  }

  return actions
}