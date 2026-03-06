/**
 * RBAC System - Role-Based Access Control
 * Fast, efficient, zero-database-query access control
 */

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  COMPLIANCE = 'COMPLIANCE',
  BDM = 'BDM',
  VENDOR = 'VENDOR',
  INVESTOR = 'INVESTOR',
  CLIENT = 'CLIENT',
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ADMIN]: 80,
  [UserRole.FINANCE]: 70,
  [UserRole.COMPLIANCE]: 65,
  [UserRole.BDM]: 60,
  [UserRole.VENDOR]: 40,
  [UserRole.INVESTOR]: 30,
  [UserRole.CLIENT]: 20,
};

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

export enum Permission {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // Vendor Management
  VENDOR_APPROVE = 'vendor:approve',
  VENDOR_MANAGE = 'vendor:manage',
  VENDOR_VIEW = 'vendor:view',
  
  // Order Management
  ORDER_CREATE = 'order:create',
  ORDER_VIEW = 'order:view',
  ORDER_MANAGE = 'order:manage',
  
  // Financial
  SETTLEMENT_VIEW = 'settlement:view',
  SETTLEMENT_PROCESS = 'settlement:process',
  PAYOUT_APPROVE = 'payout:approve',
  
  // Investment
  INVESTMENT_CREATE = 'investment:create',
  INVESTMENT_VIEW = 'investment:view',
  INVESTMENT_MANAGE = 'investment:manage',
  
  // Analytics
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_FULL = 'analytics:full',
  
  // System
  SYSTEM_CONFIG = 'system:config',
  AUDIT_VIEW = 'audit:view',
}

// ============================================================================
// ROLE → PERMISSIONS MAPPING (Fast Lookup)
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Full access to everything
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.VENDOR_APPROVE,
    Permission.VENDOR_MANAGE,
    Permission.VENDOR_VIEW,
    Permission.ORDER_CREATE,
    Permission.ORDER_VIEW,
    Permission.ORDER_MANAGE,
    Permission.SETTLEMENT_VIEW,
    Permission.SETTLEMENT_PROCESS,
    Permission.PAYOUT_APPROVE,
    Permission.INVESTMENT_CREATE,
    Permission.INVESTMENT_VIEW,
    Permission.INVESTMENT_MANAGE,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_FULL,
    Permission.SYSTEM_CONFIG,
    Permission.AUDIT_VIEW,
  ],
  
  [UserRole.ADMIN]: [
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.VENDOR_APPROVE,
    Permission.VENDOR_MANAGE,
    Permission.VENDOR_VIEW,
    Permission.ORDER_VIEW,
    Permission.ORDER_MANAGE,
    Permission.SETTLEMENT_VIEW,
    Permission.SETTLEMENT_PROCESS,
    Permission.INVESTMENT_VIEW,
    Permission.INVESTMENT_MANAGE,
    Permission.ANALYTICS_FULL,
    Permission.AUDIT_VIEW,
  ],
  
  [UserRole.FINANCE]: [
    Permission.USER_READ,
    Permission.VENDOR_VIEW,
    Permission.ORDER_VIEW,
    Permission.SETTLEMENT_VIEW,
    Permission.SETTLEMENT_PROCESS,
    Permission.PAYOUT_APPROVE,
    Permission.INVESTMENT_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.AUDIT_VIEW,
  ],
  
  [UserRole.COMPLIANCE]: [
    Permission.USER_READ,
    Permission.VENDOR_VIEW,
    Permission.VENDOR_APPROVE,
    Permission.ORDER_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.AUDIT_VIEW,
  ],
  
  [UserRole.BDM]: [
    Permission.VENDOR_MANAGE,
    Permission.VENDOR_VIEW,
    Permission.ORDER_VIEW,
    Permission.ANALYTICS_VIEW,
  ],
  
  [UserRole.VENDOR]: [
    Permission.ORDER_VIEW,
    Permission.ORDER_MANAGE,
    Permission.SETTLEMENT_VIEW,
    Permission.INVESTMENT_VIEW,
  ],
  
  [UserRole.INVESTOR]: [
    Permission.INVESTMENT_VIEW,
    Permission.ORDER_VIEW,
  ],
  
  [UserRole.CLIENT]: [
    Permission.ORDER_CREATE,
    Permission.ORDER_VIEW,
  ],
};

// ============================================================================
// ROLE → DASHBOARD ROUTE MAPPING (Fast Redirect)
// ============================================================================

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '/dashboard/admin',
  [UserRole.ADMIN]: '/dashboard/admin',
  [UserRole.FINANCE]: '/dashboard/admin',
  [UserRole.COMPLIANCE]: '/dashboard/admin',
  [UserRole.BDM]: '/dashboard/bdm',
  [UserRole.VENDOR]: '/dashboard/vendor',
  [UserRole.INVESTOR]: '/dashboard/investor',
  [UserRole.CLIENT]: '/dashboard/client',
};

// ============================================================================
// RBAC UTILITY FUNCTIONS
// ============================================================================

export class RBACService {
  /**
   * Check if role has permission (O(1) lookup)
   */
  static hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  /**
   * Check if role has any of the permissions
   */
  static hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some(p => this.hasPermission(role, p));
  }

  /**
   * Check if role has all permissions
   */
  static hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every(p => this.hasPermission(role, p));
  }

  /**
   * Get dashboard route for role (O(1) lookup)
   */
  static getDashboardRoute(role: UserRole): string {
    return ROLE_DASHBOARD_ROUTES[role] || '/';
  }

  /**
   * Check if role A can manage role B (hierarchy check)
   */
  static canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
  }

  /**
   * Get all permissions for a role
   */
  static getPermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Detect role from email (for development)
   */
  static getRoleFromEmail(email: string): UserRole {
    const emailLower = email.toLowerCase();
    
    if (emailLower.includes('superadmin')) return UserRole.SUPER_ADMIN;
    if (emailLower.includes('admin')) return UserRole.ADMIN;
    if (emailLower.includes('finance')) return UserRole.FINANCE;
    if (emailLower.includes('compliance')) return UserRole.COMPLIANCE;
    if (emailLower.includes('bdm')) return UserRole.BDM;
    if (emailLower.includes('vendor')) return UserRole.VENDOR;
    if (emailLower.includes('investor')) return UserRole.INVESTOR;
    
    return UserRole.CLIENT; // Default
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  name?: string;
}

export interface RBACContext {
  user: UserSession | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isLoading: boolean;
}