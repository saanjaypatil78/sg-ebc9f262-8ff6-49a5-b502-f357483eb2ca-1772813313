/**
 * ABAC Policy Engine - Attribute-Based Access Control
 * Evaluates dynamic policies based on user, resource, and environment attributes
 */

import { supabase } from "@/integrations/supabase/client";

export interface PolicyContext {
  user: {
    id: string;
    role: string;
    investmentTier?: string;
    totalInvestment?: number;
  };
  resource: {
    type: string;
    action: string;
  };
  environment: {
    time?: Date;
    ipAddress?: string;
    deviceTrusted?: boolean;
  };
}

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  requiresDeviceBinding?: boolean;
  requiresDualApproval?: boolean;
}

export const abacPolicyEngine = {
  /**
   * Evaluate access request against all policies
   */
  async evaluate(context: PolicyContext): Promise<PolicyDecision> {
    // Get active policies
    const { data: policies } = await supabase
      .from("security_policies")
      .select("*")
      .eq("is_active", true);
    
    if (!policies) {
      return { allowed: true };
    }
    
    // Evaluate each policy
    for (const policy of policies) {
      const decision = await this.evaluatePolicy(policy, context);
      if (!decision.allowed) {
        return decision;
      }
    }
    
    return { allowed: true };
  },

  /**
   * Evaluate single policy
   */
  async evaluatePolicy(policy: any, context: PolicyContext): Promise<PolicyDecision> {
    const conditions = policy.policy_conditions;
    
    // HIGH_VALUE_DEVICE_BINDING policy
    if (policy.policy_name === "HIGH_VALUE_DEVICE_BINDING") {
      if (context.user.totalInvestment && context.user.totalInvestment >= 50000000) {
        // ≥5 Cr requires trusted device
        if (!context.environment.deviceTrusted) {
          return {
            allowed: false,
            reason: "Trusted device required for accounts ≥₹5 Cr. Please register your device.",
            requiresDeviceBinding: true,
          };
        }
      }
    }
    
    // TRANSACTION_TIME_WINDOW policy
    if (policy.policy_name === "TRANSACTION_TIME_WINDOW") {
      const hour = (context.environment.time || new Date()).getHours();
      const startHour = conditions.start_hour || 9;
      const endHour = conditions.end_hour || 18;
      
      if (context.resource.action === "TRANSFER" || context.resource.action === "WITHDRAW") {
        if (hour < startHour || hour >= endHour) {
          return {
            allowed: false,
            reason: `Financial transactions are only allowed between ${startHour}:00 and ${endHour}:00.`,
          };
        }
      }
    }
    
    // DUAL_APPROVAL_REQUIRED policy
    if (policy.policy_name === "DUAL_APPROVAL_REQUIRED") {
      const threshold = conditions.threshold || 10000000; // ₹1 Cr default
      
      if (context.resource.action === "WITHDRAW" || context.resource.action === "TRANSFER") {
        // Check if transaction amount exceeds threshold (would need to be passed in context)
        return {
          allowed: true,
          requiresDualApproval: true,
        };
      }
    }
    
    // GEO_IP_RESTRICTION policy
    if (policy.policy_name === "GEO_IP_RESTRICTION") {
      // Check if IP is from allowed country
      // Would integrate with IP geolocation API
      const allowedCountries = conditions.allowed_countries || ["IN"];
      // const userCountry = await this.getCountryFromIP(context.environment.ipAddress);
      // if (!allowedCountries.includes(userCountry)) {
      //   return {
      //     allowed: false,
      //     reason: "Access denied from this geographic location.",
      //   };
      // }
    }
    
    return { allowed: true };
  },

  /**
   * Get user investment tier
   */
  async getUserInvestmentTier(userId: string): Promise<{ tier: string; amount: number }> {
    const { data } = await supabase
      .from("user_attributes")
      .select("investment_tier, total_investment")
      .eq("user_id", userId)
      .single();
    
    return {
      tier: data?.investment_tier || "BASIC",
      amount: data?.total_investment || 0,
    };
  },

  /**
   * Check if device binding is required for user
   */
  async requiresDeviceBinding(userId: string): Promise<boolean> {
    const { amount } = await this.getUserInvestmentTier(userId);
    return amount >= 50000000; // ≥₹5 Cr
  },

  /**
   * Log policy decision
   */
  async logPolicyDecision(
    userId: string,
    policyName: string,
    decision: PolicyDecision,
    context: PolicyContext
  ): Promise<void> {
    await supabase
      .from("login_history")
      .insert({
        user_id: userId,
        event_type: "POLICY_EVALUATION",
        success: decision.allowed,
        ip_address: context.environment.ipAddress || "127.0.0.1",
        user_agent: navigator.userAgent,
        metadata: {
          policy: policyName,
          decision,
          context,
        },
      });
  },
};