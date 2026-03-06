// src/lib/rbac/permission-codes.ts

export const PERMISSIONS = {
  // Registration Module
  REGISTRATION_CREATE: 'reg:create',
  REGISTRATION_READ: 'reg:read',
  REGISTRATION_UPDATE: 'reg:update',
  REGISTRATION_DELETE: 'reg:delete',
  KYC_VERIFY: 'kyc:verify',
  KYC_REJECT: 'kyc:reject',
  
  // Investment Module
  INVESTMENT_CREATE: 'inv:create',
  INVESTMENT_READ: 'inv:read',
  INVESTMENT_CALCULATE: 'inv:calculate',
  INVESTMENT_WITHDRAW: 'inv:withdraw',
  
  // Vendor Module
  VENDOR_CREATE: 'ven:create',
  VENDOR_READ: 'ven:read',
  VENDOR_PRODUCT_LIST: 'ven:product:list',
  VENDOR_PRODUCT_APPROVE: 'ven:product:approve',
  VENDOR_REVENUE_VIEW: 'ven:revenue:view',
  
  // Commission Module
  COMMISSION_VIEW: 'comm:view',
  COMMISSION_CALCULATE: 'comm:calculate',
  COMMISSION_PROCESS: 'comm:process',
  COMMISSION_OVERRIDE: 'comm:override',
  
  // Payout Module
  PAYOUT_VIEW: 'pay:view',
  PAYOUT_PROCESS: 'pay:process',
  PAYOUT_APPROVE: 'pay:approve',
  PAYOUT_REJECT: 'pay:reject',
  
  // Admin Module
  ADMIN_USER_MANAGE: 'admin:user:manage',
  ADMIN_SYSTEM_CONFIG: 'admin:system:config',
  ADMIN_AUDIT_VIEW: 'admin:audit:view',
  ADMIN_WEBHOOK_MANAGE: 'admin:webhook:manage',
  
  // System Module
  SYSTEM_DATABASE_ACCESS: 'sys:db:access',
  SYSTEM_WEBHOOK_EXECUTE: 'sys:webhook:execute',
  SYSTEM_FULL_ACCESS: 'sys:full:access',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  client: [ // Mapping 'client' to 'REGISTERED' level permissions for now
    'reg:create',
    'reg:read',
    'reg:update',
    'inv:create',
    'inv:read',
    'inv:calculate',
    'comm:view',
    'pay:view',
  ],
  vendor: [
    'reg:create',
    'reg:read',
    'reg:update',
    'inv:create',
    'inv:read',
    'inv:calculate',
    'ven:create',
    'ven:read',
    'ven:product:list',
    'ven:revenue:view',
    'comm:view',
    'pay:view',
  ],
  admin: [
    'reg:create',
    'reg:read',
    'reg:update',
    'reg:delete',
    'kyc:verify',
    'kyc:reject',
    'inv:create',
    'inv:read',
    'inv:calculate',
    'inv:withdraw',
    'ven:create',
    'ven:read',
    'ven:product:list',
    'ven:product:approve',
    'ven:revenue:view',
    'comm:view',
    'comm:calculate',
    'comm:process',
    'pay:view',
    'pay:process',
    'pay:approve',
    'pay:reject',
    'admin:user:manage',
    'admin:audit:view',
    'admin:webhook:manage',
  ],
  bdm: [
    'reg:create',
    'reg:read',
    'reg:update',
    'ven:create',
    'ven:read',
    'ven:revenue:view',
    'comm:view',
    'comm:calculate',
    'pay:view',
    'admin:audit:view',
  ]
};