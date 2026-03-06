// src/lib/rbac/role-definitions.ts

export interface RoleDefinition {
  level: number;
  name: string;
  description: string;
  canUpgrade: boolean;
  canDowngrade: boolean;
  requiresApproval: boolean;
  approvalLevel: number;
  maxSessionHours: number;
  require2FA: boolean;
  auditLevel: 'NONE' | 'BASIC' | 'DETAILED' | 'FULL';
}

export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  client: {
    level: 3,
    name: 'Investor/Client',
    description: 'Active investors with capital deployed',
    canUpgrade: true,
    canDowngrade: true,
    requiresApproval: false,
    approvalLevel: 0,
    maxSessionHours: 24,
    require2FA: true,
    auditLevel: 'BASIC',
  },
  vendor: {
    level: 4,
    name: 'Vendor',
    description: 'Active vendors with product listings and investments',
    canUpgrade: true,
    canDowngrade: true,
    requiresApproval: false,
    approvalLevel: 0,
    maxSessionHours: 24,
    require2FA: true,
    auditLevel: 'BASIC',
  },
  bdm: {
    level: 5, // Equivalent to Finance/Manager level in PRD
    name: 'Business Development Manager',
    description: 'BDMs managing vendor pipelines',
    canUpgrade: true,
    canDowngrade: false,
    requiresApproval: true,
    approvalLevel: 8,
    maxSessionHours: 12,
    require2FA: true,
    auditLevel: 'DETAILED',
  },
  admin: {
    level: 7,
    name: 'Admin',
    description: 'System administrators with full management capabilities',
    canUpgrade: true,
    canDowngrade: false,
    requiresApproval: true,
    approvalLevel: 9,
    maxSessionHours: 12,
    require2FA: true,
    auditLevel: 'FULL',
  }
};